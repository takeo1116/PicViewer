import React, { useState } from 'react';

interface MetadataEditorProps {
  initialTags: string[];
  initialSourceUrl?: string;
  onSave: (tags: string[], sourceUrl?: string) => void;
  onCancel: () => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ 
  initialTags, 
  initialSourceUrl, 
  onSave, 
  onCancel 
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl || '');

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = () => {
    onSave(tags, sourceUrl.trim() || undefined);
  };

  return (
    <div className="space-y-4">
      {/* タグセクション */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タグ
        </label>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新しいタグ"
            className="flex-1 text-xs border rounded px-2 py-1"
          />
          <button
            onClick={addTag}
            className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
          >
            追加
          </button>
        </div>
      </div>

      {/* 入手元URLセクション */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          入手元URL
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://example.com/image-source"
          className="w-full text-xs border rounded px-2 py-2"
        />
        {sourceUrl && (
          <p className="text-xs text-gray-500 mt-1">
            プレビュー: 
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              {sourceUrl.length > 40 ? sourceUrl.substring(0, 40) + '...' : sourceUrl}
            </a>
          </p>
        )}
      </div>

      {/* 操作ボタン */}
      <div className="flex gap-2 pt-2 border-t">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white text-xs px-3 py-2 rounded hover:bg-blue-600 flex-1"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white text-xs px-3 py-2 rounded hover:bg-gray-600 flex-1"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default MetadataEditor;