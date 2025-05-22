import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';

const { TextArea } = Input;

interface TextPromptInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onGenerate?: () => void;
}

const TextPromptInput: React.FC<TextPromptInputProps> = ({ value = '', onChange, onGenerate }) => {
  const [text, setText] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (text.length < 2) {
      setError('字数过少');
    } else if (text.length > 200) {
      setError('字数超过限制');
    } else {
      setError(null);
    }
    onChange && onChange(text);
  }, [text, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止默认换行
      if (error) {
        message.error('文本字数不符合要求，无法生成');
        return;
      }
      onGenerate && onGenerate();
    }
  };

  return (
    <div>
      <TextArea
        rows={4}
        placeholder="请输入文本提示词"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        maxLength={200}
        showCount
      />
      <div style={{ marginTop: 8, color: error ? 'red' : undefined }}>
        {error ? error : `字数：${text.length} / 200`}
      </div>
    </div>
  );
};

export default TextPromptInput;
