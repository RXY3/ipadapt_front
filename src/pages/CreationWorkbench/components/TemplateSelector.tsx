import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';

interface Template {
  id: string;
  name: string;
  image: string;
}

interface TemplateSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: string[];
}

const templatesData: Template[] = [
  { id: 'temp1', name: '模板1-中国风', image: '/image/Chinese-style.jpg' },//中国风模板
  { id: 'temp2', name: '模板2-动漫风', image: '/image/comic-style.jpg' },  //日漫风模板
  { id: 'temp3', name: '模板3-像素风', image: '/image/pixel-style.jpg' },  //像素风模板
  { id: 'temp4', name: '模板4-写实风', image: '/image/realism-style.jpg' },//写实风模板

];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ value, onChange, options = [] }) => {
  const [templates, setTemplates] = useState<Template[]>([]);

  
  useEffect(() => {
    // TODO: 后续改成接口获取
    setTemplates(templatesData);
  }, []);
  

  return (
    <Row gutter={16}>
      {templates.map(template => (
        <Col key={template.id} span={6}>
          <Card
            hoverable
            cover={<img alt={template.name} src={template.image} />}
            onClick={() => onChange && onChange(template.id)}
            bordered={value === template.id}
            style={{ borderColor: value === template.id ? '#1890ff' : undefined }}
          >
            <Card.Meta title={template.name} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TemplateSelector;
