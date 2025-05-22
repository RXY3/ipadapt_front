import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

interface ModelSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: string[];
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange, options = [] }) => {
  const [models, setModels] = useState<string[]>([]);

  
  useEffect(() => {
    // TODO: 后续改成接口获取
    setModels(['模型A', '模型B', '模型C']);
  }, []);
  

  return (
    <Select
      placeholder="选择模型"
      style={{ width: 200 }}
      value={value}
      onChange={onChange}
      options={models.map(m => ({ label: m, value: m }))}
    />
  );
};

export default ModelSelector;
