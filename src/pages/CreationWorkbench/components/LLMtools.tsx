import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';

const { TextArea } = Input;

interface TextPromptInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onGenerate?: () => void; // 生成按钮点击回调
}

const mockLLMNormalize = async (text: string): Promise<string> => {
  // 模拟调用 LLM 规范文本，实际请替换为真实接口调用
  return new Promise(resolve => {
    setTimeout(() => {
      // 简单示例：去除多余空格，首字母大写
      const normalized = text.trim().replace(/\s+/g, ' ');
      resolve(normalized.charAt(0).toUpperCase() + normalized.slice(1));
    }, 500);
  });
};

const TextPromptInput: React.FC<TextPromptInputProps> = ({ value = '', onChange, onGenerate }) => {
  const [text, setText] = useState(value);
  const [normalizedText, setNormalizedText] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 监听外部 value 变化
  useEffect(() => {
    setText(value);
    setNormalizedText(value);
  }, [value]);

  // 输入变化时调用 LLM 规范文本
  useEffect(() => {
    if (!text) {
      setError('字数过少');
      setNormalizedText('');
      return;
    }
    if (text.length < 1) {
      setError('字数过少');
      return;
    }
    if (text.length > 200) {
      setError('字数超过限制');
      return;
    }
    setError(null);
    setLoading(true);
    mockLLMNormalize(text).then(normText => {
      setNormalizedText(normText);
      setLoading(false);
      onChange && onChange(normText);
    });
  }, [text, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleGenerate = () => {
    if (error) {
      message.error('文本字数不符合要求，无法生成');
      return;
    }
    onGenerate && onGenerate();
  };

  return (
    <div>
      <TextArea
        rows={4}
        placeholder="请输入文本提示词"
        value={text}
        onChange={handleChange}
        maxLength={200}
        showCount
        disabled={loading}
      />
      <div style={{ marginTop: 8, color: error ? 'red' : 'inherit' }}>
        {error ? error : `字数：${text.length} / 200`}
      </div>
      <Button
        type="primary"
        onClick={handleGenerate}
        disabled={!!error || loading}
        loading={loading}
        style={{ marginTop: 12 }}
      >
        生成风格化图像
      </Button>
    </div>
  );
};

export default TextPromptInput;
