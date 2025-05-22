import React, { useState, useEffect } from 'react';
import { Button, message, Row, Col } from 'antd';
import ModelSelector from './components/ModelSelector';
import TemplateSelector from './components/TemplateSelector';
import ImageUploader from './components/ImageUploader';
import TextPromptInput from './components/TextPromptInput';
import ResultDisplay from './components/ResultDisplay';



const CreationWorkbench: React.FC = () => {
  const [model, setModel] = useState<string>();
  const [template, setTemplate] = useState<string>();
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultUrl, setResultUrl] = useState<string>();
  
  const [models, setModels] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch('/paint/getModelList')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(() => setModels([]));

    fetch('/paint/getTemplatesList')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(() => setTemplates([]));
  }, []);



  const onGenerate = () => {
    if (!model || !template || !image || !prompt) {
      message.warning('请完整填写所有参数');
      return;
    }

    const formData = new FormData();
    formData.append('picture', image);
    // 如果后端需要模型和模板参数，需一起传
    formData.append('model', model);
    formData.append('template', template);
    formData.append('prompt', prompt);

    
    message.loading({ content: '生成中...', key: 'generate' });
    setTimeout(() => {
      message.success({ content: '生成成功！', key: 'generate', duration: 2 });
      setResultUrl('/image/sample-output.jpg'); // 模拟结果
    }, 2000);
    

    fetch('/paint/paint_pic', {
    method: 'POST',
    body: formData,
  })
    .then(res => {
      if (!res.ok) throw new Error('生成失败');
      return res.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      message.success({ content: '生成成功！', key: 'generate', duration: 2 });
    })
    .catch(() => {
      message.error({ content: '生成失败，请重试', key: 'generate' });
    });

  };

  const onPublish = () => {
    message.info('发布功能待后端完成');
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        backgroundImage: 'url("/image/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '28px',
          marginBottom: '24px',
        }}
      >
        欢迎使用“创作工作台”
      </h2>
      
      <div style={{ marginBottom: 24 }}>
        <TemplateSelector value={template} onChange={setTemplate} options={templates} />
      </div>      
      
      <div style={{ marginBottom: 12 }}>
        <ModelSelector value={model} onChange={setModel} options={models} />
      </div>

      <Row gutter={16} style={{ marginBottom: 24, height: 180 }}>
        <Col span={12}>
          <ImageUploader value={image} onChange={setImage} />
        </Col>
        <Col span={12}>
          <TextPromptInput value={prompt} onChange={setPrompt} />
        </Col>
      </Row>

      <div style={{ marginBottom: 24 }}>
        <Button type="primary" onClick={onGenerate}>
          生成风格化图片
        </Button>
      </div>

      <ResultDisplay imageUrl={resultUrl} onPublish={onPublish} />
    </div>
  );
};

export default CreationWorkbench;
