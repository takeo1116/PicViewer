import React, { useState } from 'react';

interface TagEditorProps {
  initialTags: string[];
  onSave: (tags: string[]) => void;
  onCancel: () => void;
}

const TagEditor: React.FC<TagEditorProps> = ({ initialTags, onSave, onCancel }) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');

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

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
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
      
      <div className="flex gap-1">
        <button
          onClick={() => onSave(tags)}
          className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default TagEditor;