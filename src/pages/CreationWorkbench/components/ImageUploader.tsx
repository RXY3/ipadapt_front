import React, { useState } from 'react';
import { Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

interface ImageUploaderProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleChange = (info: any) => {
    let newFileList = info.fileList.slice(-1);
    setFileList(newFileList);
    if (newFileList.length > 0) {
      onChange && onChange(newFileList[0].originFileObj || null);
    } else {
      onChange && onChange(null);
    }
  };

  return (
    <Upload
      accept="image/*"
      beforeUpload={beforeUpload}
      onChange={handleChange}
      fileList={fileList}
      listType="picture-card"
      maxCount={1}
      onRemove={() => {
        setFileList([]);
        onChange && onChange(null);
      }}
    >
      {fileList.length >= 1 ? null : '+ 上传'}
    </Upload>
  );
};

export default ImageUploader;
