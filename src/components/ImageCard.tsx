import React, { useState } from 'react';
import { ImageFile } from '../types';
import { getImageSrc, saveImageMetadata } from '../services/localImages';
import MetadataEditor from './MetadataEditor';
import ImageModal from './ImageModal';

interface ImageCardProps {
  image: ImageFile;
  onTagsUpdated: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onTagsUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSaveMetadata = async (newTags: string[], newSourceUrl?: string) => {
    try {
      await saveImageMetadata(image.path, newTags, newSourceUrl);
      setIsEditing(false);
      onTagsUpdated();
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        <img
          src={getImageSrc(image.path)}
          alt={image.name}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowModal(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">画像を読み込めません</div>';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-sm mb-2 truncate" title={image.name}>
          {image.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {formatFileSize(image.size)}
        </p>
        
        {isEditing ? (
          <MetadataEditor
            initialTags={image.tags}
            initialSourceUrl={image.sourceUrl}
            onSave={handleSaveMetadata}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div>
            {/* タグ表示 */}
            <div className="flex flex-wrap gap-1 mb-2 min-h-[24px]">
              {image.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* 入手元URL表示 */}
            {image.sourceUrl && (
              <div className="mb-2">
                <p className="text-xs text-gray-500">入手元:</p>
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline break-all"
                  title={image.sourceUrl}
                >
                  {image.sourceUrl.length > 30 
                    ? image.sourceUrl.substring(0, 30) + '...' 
                    : image.sourceUrl}
                </a>
              </div>
            )}
            
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              📝 編集
            </button>
          </div>
        )}
      </div>
      
      <ImageModal
        src={getImageSrc(image.path)}
        alt={image.name}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ImageCard;