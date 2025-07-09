import React from 'react';
import { selectFolder } from '../services/tauri';

interface FolderSelectorProps {
  selectedFolder: string | null;
  onFolderSelected: (folder: string | null) => void;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({ selectedFolder, onFolderSelected }) => {
  const handleSelectFolder = async () => {
    console.log('フォルダ選択ボタンがクリックされました');
    try {
      const folder = await selectFolder();
      console.log('selectFolder の結果:', folder);
      onFolderSelected(folder);
      console.log('onFolderSelected が呼び出されました');
    } catch (error) {
      console.error('フォルダ選択エラー:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">画像フォルダを選択</h2>
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        onClick={handleSelectFolder}
      >
        フォルダを選択
      </button>
      {selectedFolder && (
        <p className="mt-2 text-gray-600 text-sm">
          選択中: {selectedFolder}
        </p>
      )}
    </div>
  );
};

export default FolderSelector;