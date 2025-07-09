import { ImageFile, MetadataStore } from '../types';
// @ts-ignore
import imageFiles from 'virtual:pics-list';

const PICS_DIRECTORY = '/pics';

let metadataStore: MetadataStore = {};

// 画像ファイル一覧を動的に取得
const getImageFiles = async (): Promise<Array<{name: string, size: number}>> => {
  try {
    // 統一されたAPIエンドポイントから取得
    const response = await fetch('/api/scan-pics');
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.files)) {
        console.log('API経由で画像ファイルを取得しました:', data.files.length, '件');
        return data.files;
      }
    }
    
    // フォールバック1: 本番環境用の静的ファイル
    try {
      const fallbackResponse = await fetch('/api/scan-pics.json');
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.success && Array.isArray(fallbackData.files)) {
          console.log('静的ファイル経由で画像ファイルを取得しました:', fallbackData.files.length, '件');
          return fallbackData.files;
        }
      }
    } catch (fallbackError) {
      console.warn('静的ファイルの読み込みに失敗:', fallbackError);
    }
    
    
    // 最後のフォールバック: 仮想モジュール
    console.log('仮想モジュールを使用します');
    return imageFiles || [];
  } catch (error) {
    console.error('画像ファイル一覧の取得に失敗しました:', error);
    // 最後のフォールバック
    return imageFiles || [];
  }
};

// メタデータファイルからメタデータを読み込み
const loadMetadataStore = async (): Promise<MetadataStore> => {
  try {
    const response = await fetch('/pics/.picviewer-metadata.json');
    if (response.ok) {
      const data = await response.json();
      return data || {};
    }
    return {};
  } catch {
    return {};
  }
};

// メタデータファイルにメタデータを保存
const saveMetadataStore = async (data: MetadataStore): Promise<void> => {
  try {
    // サーバーAPIを使用してファイルに保存
    const response = await fetch('/api/save-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      console.log('メタデータをファイルに保存しました:', data);
    } else {
      throw new Error('サーバーへの保存に失敗');
    }
    
    // フォールバック: localStorageにも保存
    localStorage.setItem('picviewer-metadata', JSON.stringify(data));
  } catch (error) {
    console.error('メタデータの保存に失敗しました:', error);
    // エラー時はlocalStorageのみに保存
    localStorage.setItem('picviewer-metadata', JSON.stringify(data));
  }
};

export const loadImages = async (): Promise<ImageFile[]> => {
  console.log('Local: 画像を読み込み中...');
  
  // メタデータを読み込み
  try {
    metadataStore = await loadMetadataStore();
  } catch (error) {
    console.warn('メタデータの読み込みに失敗、localStorageから読み込みます:', error);
    // フォールバック: localStorageから読み込み
    const stored = localStorage.getItem('picviewer-metadata');
    metadataStore = stored ? JSON.parse(stored) : {};
  }
  
  const files = await getImageFiles();
  console.log('Local: 検出された画像ファイル:', files);
  
  const images: ImageFile[] = files.map(fileInfo => {
    const filename = fileInfo.name;
    const metadata = metadataStore[filename] || { tags: [], sourceUrl: undefined };
    return {
      path: `${PICS_DIRECTORY}/${filename}`,
      name: filename,
      size: fileInfo.size, // 実際のファイルサイズを使用
      tags: metadata.tags,
      sourceUrl: metadata.sourceUrl
    };
  });
  
  console.log('Local: 画像を読み込みました:', images);
  return images;
};

export const loadTagsForImage = async (imagePath: string): Promise<string[]> => {
  const filename = imagePath.split('/').pop() || '';
  return metadataStore[filename]?.tags || [];
};

export const saveTagsForImage = async (imagePath: string, tags: string[]): Promise<void> => {
  const filename = imagePath.split('/').pop() || '';
  if (!metadataStore[filename]) {
    metadataStore[filename] = { tags: [], sourceUrl: undefined };
  }
  metadataStore[filename].tags = tags;
  await saveMetadataStore(metadataStore);
  console.log('Local: タグを保存しました:', filename, tags);
};

export const loadSourceUrlForImage = async (imagePath: string): Promise<string | undefined> => {
  const filename = imagePath.split('/').pop() || '';
  return metadataStore[filename]?.sourceUrl;
};

export const saveSourceUrlForImage = async (imagePath: string, sourceUrl: string): Promise<void> => {
  const filename = imagePath.split('/').pop() || '';
  if (!metadataStore[filename]) {
    metadataStore[filename] = { tags: [], sourceUrl: undefined };
  }
  metadataStore[filename].sourceUrl = sourceUrl || undefined;
  await saveMetadataStore(metadataStore);
  console.log('Local: 入手元URLを保存しました:', filename, sourceUrl);
};

export const saveImageMetadata = async (imagePath: string, tags: string[], sourceUrl?: string): Promise<void> => {
  const filename = imagePath.split('/').pop() || '';
  metadataStore[filename] = {
    tags,
    sourceUrl: sourceUrl || undefined
  };
  await saveMetadataStore(metadataStore);
  console.log('Local: メタデータを保存しました:', filename, { tags, sourceUrl });
};

export const getImageSrc = (filePath: string): string => {
  // Viteの開発サーバーで画像を直接参照
  return filePath;
};