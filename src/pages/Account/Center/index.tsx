import { useModel } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Tag,
  Upload,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      padding: '48px',
      background: token.colorBgLayout,
    },
    card: {
      borderRadius: 16,
      boxShadow: token.boxShadowSecondary,
    },
    avatar: {
      width: '100px',
      height: '100px',
      marginBottom: '16px',
    },
    userName: {
      fontSize: '22px',
      fontWeight: 700,
      marginBottom: '8px',
    },
    tagList: {
      marginBottom: '16px',
    },
    divider: {
      margin: '24px 0',
    },
    info: {
      marginBottom: '16px',
    },
    infoItem: {
      marginBottom: '8px',
    },
    infoLabel: {
      marginRight: '8px',
      fontWeight: 'bold',
    },
  };
});

type TagType = {
  key: string;
  label: string;
};

const Center: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [tags, setTags] = useState<TagType[]>(
    Array.isArray(currentUser?.tags) ? currentUser.tags as TagType[] : []
  );
  const [inputTag, setInputTag] = useState('');

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setInitialState({
        ...initialState,
        currentUser: {
          ...currentUser,
          ...values,
          tags,
        },
      });
      setEditing(false);
      message.success('信息更新成功');
    } catch (err) {
      message.error('请检查输入内容');
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setInitialState({
        ...initialState,
        currentUser: {
          ...currentUser,
          avatar: URL.createObjectURL(info.file.originFileObj),
        },
      });
      message.success('头像上传成功');
    }
  };

  const handleAddTag = () => {
    if (inputTag && !tags.find(tag => tag.label === inputTag)) {
      const newTag: TagType = { key: Date.now().toString(), label: inputTag };
      setTags([...tags, newTag]);
      setInputTag('');
    }
  };

  const handleRemoveTag = (key: string | number) => {
    setTags(tags.filter(tag => tag.key !== key));
  };

  return (
    <div className={styles.container}>
      <Row gutter={32}>
        <Col span={8}>
          <Card className={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <Upload
                showUploadList={false}
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
                disabled={!editing}
              >
                <Avatar size={100} src={currentUser?.avatar} className={styles.avatar} />
                {editing && <div><Button icon={<UploadOutlined />} size="small" style={{ marginTop: 8 }}>更换头像</Button></div>}
              </Upload>
              <div className={styles.userName}>
                {editing ? (
                  <Form form={form} layout="inline">
                    <Form.Item name="name" initialValue={currentUser?.name}>
                      <Input size="small" placeholder="用户名" />
                    </Form.Item>
                  </Form>
                ) : (
                  currentUser?.name
                )}
              </div>
              <div style={{ color: '#888' }}>{currentUser?.title}</div>
              <div style={{ color: '#888' }}>{currentUser?.group}</div>
            </div>
            <Divider className={styles.divider} />
            <div className={styles.tagList}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>标签</div>
              {tags.map((tag) => (
                <Tag
                  key={tag.key}
                  color="blue"
                  closable={editing}
                  onClose={() => handleRemoveTag(tag.key)}
                  style={{ margin: '6px' }}
                >
                  {tag.label}
                </Tag>
              ))}
              {editing && (
                <Input
                  size="small"
                  style={{ width: '100%', marginTop: 8 }}
                  value={inputTag}
                  onChange={(e) => setInputTag(e.target.value)}
                  onPressEnter={handleAddTag}
                  placeholder="输入新标签并回车确认"
                  suffix={<PlusOutlined onClick={handleAddTag} />}
                />
              )}
            </div>
            <Divider className={styles.divider} />
            <div className={styles.info}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>个人介绍</div>
              {editing ? (
                <Form form={form} layout="vertical">
                  <Form.Item name="signature" initialValue={currentUser?.signature}>
                    <Input.TextArea rows={3} placeholder="输入个人介绍" />
                  </Form.Item>
                </Form>
              ) : (
                <div style={{ color: '#666' }}>{currentUser?.signature || '暂无介绍'}</div>
              )}
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card
            className={styles.card}
            title={<span style={{ fontWeight: 600, fontSize: '18px' }}>个人信息</span>}
            extra={
              editing ? (
                <>
                  <Button type="link" onClick={() => setEditing(false)}>取消</Button>
                  <Button type="primary" onClick={handleSave}>保存</Button>
                </>
              ) : (
                <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>编辑</Button>
              )
            }
          >
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                email: currentUser?.email,
                phone: currentUser?.phone,
                address: currentUser?.address,
                name: currentUser?.name,
                signature: currentUser?.signature,
              }}
              disabled={!editing}
            >
              <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效的邮箱' }]}>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item name="phone" label="电话">
                <Input placeholder="请输入电话" />
              </Form.Item>
              <Form.Item name="address" label="地址">
                <Input placeholder="请输入地址" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Center;
