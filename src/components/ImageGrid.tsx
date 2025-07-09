import React from 'react';
import { ImageFile } from '../types';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: ImageFile[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, loading, error, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">エラー: {error}</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">画像が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.path}
          image={image}
          onTagsUpdated={onRefresh}
        />
      ))}
    </div>
  );
};

export default ImageGrid;