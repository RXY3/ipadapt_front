import React from 'react';
import { Image, Button, message } from 'antd';

interface ResultDisplayProps {
  imageUrl?: string;
  onPublish?: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, onPublish }) => {
  if (!imageUrl) return null;

  return (
    <div>
      <Image 
      src={imageUrl} 
      alt="风格化结果" 
      style={{ maxWidth: '100%', width: '100px', height: 'auto' }}
      />

      <div style={{ marginTop: 8 }}>
        <a href={imageUrl} download="styled_image.png">
          <Button>下载图片</Button>
        </a>
        <Button style={{ marginLeft: 8 }} onClick={onPublish}>
          发布作品
        </Button>
      </div>

    </div>
  );
};

export default ResultDisplay;
