import { useState, useEffect, useCallback } from 'react';
import { ImageFile } from '../types';
import { loadImages } from '../services/localImages';

export const useImages = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const imageFiles = await loadImages();
      setImages(imageFiles);
      console.log('画像を読み込みました:', imageFiles.length, '件');
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回読み込み
  useEffect(() => {
    loadAllImages();
  }, [loadAllImages]);

  return { 
    images, 
    loading, 
    error, 
    refreshImages: loadAllImages 
  };
};