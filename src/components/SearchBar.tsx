import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onTagFilter: (tags: string[]) => void;
  availableTags: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onTagFilter, availableTags }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleTag = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    onTagFilter(newSelectedTags);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    onSearch('');
    onTagFilter([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ファイル名で検索
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="画像ファイル名を入力..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {availableTags.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグで絞り込み
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {(searchQuery || selectedTags.length > 0) && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {searchQuery && `検索: "${searchQuery}"`}
            {searchQuery && selectedTags.length > 0 && ' / '}
            {selectedTags.length > 0 && `タグ: ${selectedTags.join(', ')}`}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            クリア
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;