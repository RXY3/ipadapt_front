import React, { useState, useEffect } from 'react';
import { Tabs, Card, Row, Col, Button, Drawer, message, Avatar, Badge, Input, Spin, List, Modal } from 'antd';
import { HeartOutlined, HeartFilled, CommentOutlined, StarOutlined, StarFilled, ShareAltOutlined, EyeOutlined, FireOutlined, ClockCircleOutlined, TeamOutlined, CheckOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const { TabPane } = Tabs;
const { Meta } = Card;
const { TextArea } = Input;

// 样式定义
const useStyles = createStyles(({ token }) => ({
  container: {
    padding: '24px',
    backgroundColor: token.colorBgLayout,
    minHeight: '100vh',
  },
  artworkCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: token.boxShadowSecondary,
    }
  },
  coverImage: {
    height: '240px',
    objectFit: 'cover',
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  commentItem: {
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  actionButton: {
    color: token.colorTextSecondary,
    '&:hover': {
      color: token.colorPrimary,
    },
    marginRight: '24px',
  },
}));

// 模拟数据：作品
const mockArtworks = Array(20).fill(null).map((_, index) => ({
  id: `artwork-${index}`,
  title: `风格化作品 ${index + 1}`,
  imageUrl: `https://picsum.photos/800/600?random=${index}`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  author: {
    id: `user-${Math.ceil(Math.random() * 10)}`,
    name: `用户${Math.ceil(Math.random() * 10)}`,
    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.ceil(Math.random() * 50)}.jpg`,
  },
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 50),
  stars: Math.floor(Math.random() * 100),
  views: Math.floor(Math.random() * 5000),
  description: '这是一张使用风格化图像生成平台创作的艺术作品，融合了现代技术与艺术美学，呈现出独特的视觉风格。',
  tags: ['风格化', '人像', 'AI生成', '艺术创作'].slice(0, Math.ceil(Math.random() * 4)),
}));

// 模拟评论数据
const generateMockComments = (artworkId) => {
  return Array(Math.floor(Math.random() * 10) + 3).fill(null).map((_, index) => ({
    id: `comment-${artworkId}-${index}`,
    content: `这是对作品的评论，点赞支持！评论内容 ${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    author: {
      id: `user-${Math.ceil(Math.random() * 20)}`,
      name: `评论用户${Math.ceil(Math.random() * 20)}`,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.ceil(Math.random() * 50)}.jpg`,
    },
    likes: Math.floor(Math.random() * 50),
  }));
};

const Information: React.FC = () => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState('popular');
  const [loading, setLoading] = useState(false);
  const [artworks, setArtworks] = useState(mockArtworks);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentArtwork, setCurrentArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState({});
  const [starred, setStarred] = useState({});
  const [followed, setFollowed] = useState({});  // 添加关注状态
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);

  // 模拟加载数据
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      filterArtworks(activeTab);
      setLoading(false);
    }, 500);
  }, [activeTab]);

  // 根据标签筛选作品
  const filterArtworks = (tab) => {
    let filtered = [...artworks];
    
    switch(tab) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'following':
        // 获取已关注的作者ID列表
        const followedUserIds = Object.keys(followed).filter(id => followed[id]);
        
        if (followedUserIds.length === 0) {
          // 如果没有关注的作者，则使用默认的模拟数据
          const followingAuthors = artworks.slice(0, 5).map(art => art.author.id);
          filtered = filtered.filter(art => followingAuthors.includes(art.author.id));
        } else {
          // 如果有已关注的作者，则显示他们的作品
          filtered = filtered.filter(art => followedUserIds.includes(art.author.id));
        }
        break;
      default:
        break;
    }
    
    setFilteredArtworks(filtered);
  };

  // 处理关注/取消关注
  const handleFollow = (userId) => {
    setFollowed(prev => {
      const newFollowed = { ...prev, [userId]: !prev[userId] };
      return newFollowed;
    });
    
    // 使用setTimeout确保能获取到最新状态
    setTimeout(() => {
      const isFollowed = !followed[userId];
      message.success(isFollowed ? '关注成功' : '已取消关注');
      
      // 如果当前在"关注"标签，需要重新过滤作品
      if (activeTab === 'following') {
        filterArtworks('following');
      }
    }, 100);
  };

  // 打开作品详情
  const openArtworkDetail = (artwork) => {
    setCurrentArtwork(artwork);
    setComments(generateMockComments(artwork.id));
    setDetailVisible(true);
  };

  // 关闭作品详情
  const closeArtworkDetail = () => {
    setDetailVisible(false);
    setCurrentArtwork(null);
  };

  // 处理点赞
  const handleLike = (artworkId) => {
    setLiked(prev => {
      const newLiked = { ...prev, [artworkId]: !prev[artworkId] };
      return newLiked;
    });
    
    setArtworks(prev => 
      prev.map(art => 
        art.id === artworkId 
          ? { 
              ...art, 
              likes: liked[artworkId] ? art.likes - 1 : art.likes + 1 
            } 
          : art
      )
    );
    
    message.success(liked[artworkId] ? '已取消点赞' : '点赞成功');
  };

  // 处理收藏
  const handleStar = (artworkId) => {
    setStarred(prev => {
      const newStarred = { ...prev, [artworkId]: !prev[artworkId] };
      return newStarred;
    });
    
    setArtworks(prev => 
      prev.map(art => 
        art.id === artworkId 
          ? { 
              ...art, 
              stars: starred[artworkId] ? art.stars - 1 : art.stars + 1 
            } 
          : art
      )
    );
    
    message.success(starred[artworkId] ? '已取消收藏' : '收藏成功');
  };

  // 提交评论
  const submitComment = () => {
    if (!newComment.trim()) {
      message.error('评论内容不能为空');
      return;
    }

    const newCommentObj = {
      id: `comment-${currentArtwork.id}-${comments.length}`,
      content: newComment,
      createdAt: new Date().toISOString(),
      author: {
        id: 'current-user',
        name: '当前用户',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      likes: 0,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    
    setArtworks(prev => 
      prev.map(art => 
        art.id === currentArtwork.id 
          ? { 
              ...art, 
              comments: art.comments + 1 
            } 
          : art
      )
    );
    
    message.success('评论发布成功');
  };

  // 查看用户详情
  const viewUserDetail = (user) => {
    setCurrentUser(user);
    setUserArtworks(artworks.filter(art => art.author.id === user.id));
    setUserDetailVisible(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <Card title="作品展示" bordered={false}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          tabBarGutter={40}
        >
          <TabPane 
            tab={<span><FireOutlined /> 热门作品</span>} 
            key="popular"
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[24, 24]}>
                {filteredArtworks.map(artwork => (
                  <Col xs={24} sm={12} md={8} lg={6} key={artwork.id}>
                    <Card
                      className={styles.artworkCard}
                      cover={
                        <img
                          alt={artwork.title}
                          src={artwork.imageUrl}
                          className={styles.coverImage}
                          onClick={() => openArtworkDetail(artwork)}
                        />
                      }
                      actions={[
                        liked[artwork.id] 
                          ? (
                            <Badge count={artwork.likes} style={{ 
                                backgroundColor: 'rgba(255, 77, 79, 0.6)',  // 背景透明
                                boxShadow: 'none'               // 去掉默认的阴影
                              }} size="small" offset={[0, 0]} overflowCount={999} >
                              <HeartFilled 
                                style={{ color: '#ff4d4f', fontSize: '18px'}} 
                                onClick={() => handleLike(artwork.id)} 
                              />
                            </Badge>
                          ) 
                          : (
                            <Badge count={artwork.likes} style={{ 
                                  backgroundColor: 'rgba(255, 77, 79, 0.6)',  // 背景透明
                                  boxShadow: 'none'               // 去掉默认的阴影
                                }} size="small" offset={[0, 0]} overflowCount={999} >
                              <HeartOutlined 
                                style={{ fontSize: '18px' }} 
                                onClick={() => handleLike(artwork.id)} 
                              />
                            </Badge>
                          ),
                      
                        <Badge count={artwork.comments} size="small" offset={[0, 0]} overflowCount={999} style={{ backgroundColor: 'rgba(24, 144, 255, 0.6)', boxShadow: 'none' }}>
                          <CommentOutlined style={{ fontSize: '18px' }} onClick={() => openArtworkDetail(artwork)} />
                        </Badge>,
                      
                        starred[artwork.id] 
                          ? <StarFilled 
                              style={{ color: '#faad14', fontSize: '18px'}} 
                              onClick={() => handleStar(artwork.id)} 
                            /> 
                          : <StarOutlined style={{ color: '#faad14', fontSize: '18px'}} onClick={() => handleStar(artwork.id)} />
                      ]}
                    >
                      <Meta
                        avatar={
                          <Avatar 
                            src={artwork.author.avatar} 
                            onClick={() => viewUserDetail(artwork.author)} 
                            style={{ cursor: 'pointer' }}
                          />
                        }
                        title={artwork.title}
                        description={
                          <>
                            <div>{artwork.author.name}</div>
                            <div>{formatDate(artwork.createdAt)}</div>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
          <TabPane 
            tab={<span><ClockCircleOutlined /> 最新作品</span>} 
            key="recent"
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[24, 24]}>
                {filteredArtworks.map(artwork => (
                  <Col xs={24} sm={12} md={8} lg={6} key={artwork.id}>
                    <Card
                      className={styles.artworkCard}
                      cover={
                        <img
                          alt={artwork.title}
                          src={artwork.imageUrl}
                          className={styles.coverImage}
                          onClick={() => openArtworkDetail(artwork)}
                        />
                      }
                      actions={[
                        liked[artwork.id] 
                          ? <HeartFilled 
                              style={{ color: '#ff4d4f' }} 
                              onClick={() => handleLike(artwork.id)} 
                            /> 
                          : <HeartOutlined onClick={() => handleLike(artwork.id)} />,
                        <CommentOutlined onClick={() => openArtworkDetail(artwork)} />,
                        starred[artwork.id] 
                          ? <StarFilled 
                              style={{ color: '#faad14' }} 
                              onClick={() => handleStar(artwork.id)} 
                            /> 
                          : <StarOutlined onClick={() => handleStar(artwork.id)} />
                      ]}
                    >
                      <Meta
                        avatar={
                          <Avatar 
                            src={artwork.author.avatar} 
                            onClick={() => viewUserDetail(artwork.author)} 
                            style={{ cursor: 'pointer' }}
                          />
                        }
                        title={artwork.title}
                        description={
                          <>
                            <div>{artwork.author.name} · {formatDate(artwork.createdAt)}</div>
                            <div>
                              <Badge count={artwork.likes} size="small" offset={[2, 0]} overflowCount={999} style={{ backgroundColor: '#ff4d4f' }}>
                                <HeartOutlined />
                              </Badge>
                              <span style={{ marginRight: 12 }}></span>
                              <Badge count={artwork.comments} size="small" offset={[2, 0]} overflowCount={999} style={{ backgroundColor: '#1890ff' }}>
                                <CommentOutlined />
                              </Badge>
                            </div>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
          <TabPane 
            tab={<span><TeamOutlined /> 关注</span>} 
            key="following"
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : filteredArtworks.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredArtworks.map(artwork => (
                  <Col xs={24} sm={12} md={8} lg={6} key={artwork.id}>
                    <Card
                      className={styles.artworkCard}
                      cover={
                        <img
                          alt={artwork.title}
                          src={artwork.imageUrl}
                          className={styles.coverImage}
                          onClick={() => openArtworkDetail(artwork)}
                        />
                      }
                      actions={[
                        liked[artwork.id] 
                          ? <HeartFilled 
                              style={{ color: '#ff4d4f' }} 
                              onClick={() => handleLike(artwork.id)} 
                            /> 
                          : <HeartOutlined onClick={() => handleLike(artwork.id)} />,
                        <CommentOutlined onClick={() => openArtworkDetail(artwork)} />,
                        starred[artwork.id] 
                          ? <StarFilled 
                              style={{ color: '#faad14' }} 
                              onClick={() => handleStar(artwork.id)} 
                            /> 
                          : <StarOutlined onClick={() => handleStar(artwork.id)} />
                      ]}
                    >
                      <Meta
                        avatar={
                          <Avatar 
                            src={artwork.author.avatar} 
                            onClick={() => viewUserDetail(artwork.author)} 
                            style={{ cursor: 'pointer' }}
                          />
                        }
                        title={artwork.title}
                        description={
                          <>
                            <div>{artwork.author.name} · {formatDate(artwork.createdAt)}</div>
                            <div>
                              <Badge count={artwork.likes} size="small" offset={[2, 0]} overflowCount={999} style={{ backgroundColor: '#ff4d4f' }}>
                                <HeartOutlined />
                              </Badge>
                              <span style={{ marginRight: 12 }}></span>
                              <Badge count={artwork.comments} size="small" offset={[2, 0]} overflowCount={999} style={{ backgroundColor: '#1890ff' }}>
                                <CommentOutlined />
                              </Badge>
                            </div>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                你还没有关注任何人，去探索并关注喜欢的创作者吧！
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* 作品详情抽屉 */}
      <Drawer
        width={900}
        placement="right"
        closable={false}
        onClose={closeArtworkDetail}
        open={detailVisible}
        bodyStyle={{ padding: 0 }}
      >
        {currentArtwork && (
          <div>
            <div style={{ padding: '24px' }}>
              <div className={styles.detailHeader}>
                <div className={styles.avatarContainer}>
                  <Avatar 
                    size={40} 
                    src={currentArtwork.author.avatar} 
                    onClick={() => viewUserDetail(currentArtwork.author)} 
                    style={{ cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentArtwork.author.name}</div>
                    <div style={{ color: '#999', fontSize: '12px' }}>{formatDate(currentArtwork.createdAt)}</div>
                  </div>
                </div>
                <Button 
                  type={followed[currentArtwork.author.id] ? "default" : "primary"} 
                  size="large" 
                  icon={followed[currentArtwork.author.id] ? <CheckOutlined /> : null}
                  onClick={() => handleFollow(currentArtwork.author.id)}
                >
                  {followed[currentArtwork.author.id] ? '已关注' : '关注'}
                </Button>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h2>{currentArtwork.title}</h2>
                <p>{currentArtwork.description}</p>
                <div style={{ marginTop: '8px' }}>
                  {currentArtwork.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      style={{ 
                        background: '#f0f2f5', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        marginRight: '8px',
                        fontSize: '12px'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <img 
                src={currentArtwork.imageUrl} 
                alt={currentArtwork.title} 
                style={{ width: '100%', borderRadius: '8px', marginBottom: '24px' }}
              />
              
              <div style={{ display: 'flex', marginBottom: '24px' }}>
                <div 
                  className={styles.actionButton}
                  onClick={() => handleLike(currentArtwork.id)}
                >
                  {liked[currentArtwork.id] ? (
                    <HeartFilled style={{ color: '#ff4d4f' }} />
                  ) : (
                    <HeartOutlined />
                  )}
                  <span style={{ marginLeft: '8px' }}>
                    {liked[currentArtwork.id] 
                      ? currentArtwork.likes + 1 
                      : currentArtwork.likes} 点赞
                  </span>
                </div>
                
                <div className={styles.actionButton}>
                  <CommentOutlined />
                  <span style={{ marginLeft: '8px' }}>{comments.length} 评论</span>
                </div>
                
                <div 
                  className={styles.actionButton}
                  onClick={() => handleStar(currentArtwork.id)}
                >
                  {starred[currentArtwork.id] ? (
                    <StarFilled style={{ color: '#faad14' }} />
                  ) : (
                    <StarOutlined />
                  )}
                  <span style={{ marginLeft: '8px' }}>
                    {starred[currentArtwork.id] 
                      ? currentArtwork.stars + 1 
                      : currentArtwork.stars} 收藏
                  </span>
                </div>
                
                <div className={styles.actionButton}>
                  <ShareAltOutlined />
                  <span style={{ marginLeft: '8px' }}>分享</span>
                </div>
                
                <div className={styles.actionButton}>
                  <EyeOutlined />
                  <span style={{ marginLeft: '8px' }}>{currentArtwork.views} 浏览</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>评论</h3>
                <div style={{ display: 'flex' }}>
                  <Avatar 
                    src="https://randomuser.me/api/portraits/men/1.jpg" 
                    style={{ marginRight: '16px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <TextArea 
                      rows={3} 
                      placeholder="写下你的评论..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      maxLength={200}
                      showCount
                    />
                    <div style={{ marginTop: '8px', textAlign: 'right' }}>
                      <Button 
                        type="primary" 
                        size="middle"
                        onClick={submitComment}
                      >
                        发布评论
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <List
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={comment => (
                  <List.Item className={styles.commentItem}>
                    <List.Item.Meta
                      avatar={<Avatar src={comment.author.avatar} />}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{comment.author.name}</span>
                          <span style={{ color: '#999', fontSize: '12px' }}>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      }
                      description={comment.content}
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Drawer>

      {/* 用户详情弹窗 */}
      <Modal
        title="用户作品"
        open={userDetailVisible}
        onCancel={() => setUserDetailVisible(false)}
        footer={null}
        width={1000}
      >
        {currentUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar size={64} src={currentUser.avatar} />
              <div style={{ marginLeft: '16px' }}>
                <h2 style={{ marginBottom: '4px' }}>{currentUser.name}</h2>
                <Button 
                  type={followed[currentUser.id] ? "default" : "primary"}
                  icon={followed[currentUser.id] ? <CheckOutlined /> : null}
                  onClick={() => handleFollow(currentUser.id)}
                >
                  {followed[currentUser.id] ? '已关注' : '关注'}
                </Button>
              </div>
            </div>
            
            <h3 style={{ marginBottom: '16px' }}>创作作品 ({userArtworks.length})</h3>
            <Row gutter={[16, 16]}>
              {userArtworks.map(artwork => (
                <Col span={6} key={artwork.id}>
                  <Card
                    hoverable
                    cover={<img alt={artwork.title} src={artwork.imageUrl} />}
                    onClick={() => {
                      setUserDetailVisible(false);
                      openArtworkDetail(artwork);
                    }}
                  >
                    <Meta
                      title={artwork.title}
                      description={`${artwork.likes} 赞 · ${artwork.comments} 评论`}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Information;