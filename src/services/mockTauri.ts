import { ImageFile } from '../types';

export const selectFolder = async (): Promise<string | null> => {
  // デモ用：実際のフォルダ選択の代わりにダイアログで模擬
  const userConfirmed = confirm('フォルダを選択しますか？（デモモード）\n\nOKを押すとサンプルフォルダが選択されます。');
  
  if (userConfirmed) {
    const mockFolderPath = '/demo/pictures';
    console.log('Mock: フォルダが選択されました:', mockFolderPath);
    return mockFolderPath;
  } else {
    console.log('Mock: フォルダ選択がキャンセルされました');
    return null;
  }
  
  // 以下は実際のフォルダ選択の実装（ブラウザの制限で動作しない場合があります）
  /*
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    
    console.log('Mock: フォルダ選択ダイアログを開きます...');
    
    let resolved = false;
    
    input.onchange = (event: Event) => {
      console.log('Mock: フォルダが選択されました');
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const path = file.webkitRelativePath.split('/')[0];
        console.log('Mock: 選択されたフォルダ:', path);
        if (!resolved) {
          resolved = true;
          resolve(path);
        }
      } else {
        console.log('Mock: ファイルが選択されませんでした');
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }
    };
    
    // キャンセル時の処理
    input.oncancel = () => {
      console.log('Mock: フォルダ選択がキャンセルされました');
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    };
    
    // フォーカスが戻った時の処理（キャンセル検出用）
    const handleFocus = () => {
      setTimeout(() => {
        if (!input.files || input.files.length === 0) {
          console.log('Mock: フォルダ選択がキャンセルされた可能性があります');
          if (!resolved) {
            resolved = true;
            resolve(null);
          }
        }
        window.removeEventListener('focus', handleFocus);
      }, 1000);
    };
    
    window.addEventListener('focus', handleFocus);
    input.click();
  });
  */
};

export const readDirectory = async (path: string): Promise<ImageFile[]> => {
  console.log('Mock: ディレクトリを読み込み中:', path);
  
  // 実際に選択されたフォルダからファイルを読み込む場合の処理を想定
  const mockImages: ImageFile[] = [
    {
      path: `${path}/sample1.jpg`,
      name: 'sample1.jpg',
      size: 1024000,
      tags: ['風景', '自然']
    },
    {
      path: `${path}/sample2.png`,
      name: 'sample2.png',
      size: 2048000,
      tags: ['建物', '都市']
    },
    {
      path: `${path}/sample3.gif`,
      name: 'sample3.gif',
      size: 512000,
      tags: ['動物', '可愛い']
    }
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: 画像を読み込みました:', mockImages);
      resolve(mockImages);
    }, 500);
  });
};

export const loadTagsForImage = async (imagePath: string): Promise<string[]> => {
  const mockTags: { [key: string]: string[] } = {
    '/mock/sample1.jpg': ['風景', '自然'],
    '/mock/sample2.png': ['建物', '都市'],
    '/mock/sample3.gif': ['動物', '可愛い']
  };
  
  return mockTags[imagePath] || [];
};

export const saveTagsForImage = async (imagePath: string, tags: string[]): Promise<void> => {
  console.log('Mock: Saving tags for', imagePath, tags);
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 200);
  });
};

export const getImageSrc = (filePath: string): string => {
  const mockImages: { [key: string]: string } = {
    '/mock/sample1.jpg': 'https://via.placeholder.com/400x400/4CAF50/FFFFFF?text=Sample1',
    '/mock/sample2.png': 'https://via.placeholder.com/400x400/2196F3/FFFFFF?text=Sample2',
    '/mock/sample3.gif': 'https://via.placeholder.com/400x400/FF9800/FFFFFF?text=Sample3'
  };
  
  return mockImages[filePath] || 'https://via.placeholder.com/400x400/9E9E9E/FFFFFF?text=No+Image';
};