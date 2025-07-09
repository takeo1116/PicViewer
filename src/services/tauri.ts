import { ImageFile } from '../types';

const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

export const selectFolder = async (): Promise<string | null> => {
  if (isTauri) {
    const { open } = await import('@tauri-apps/api/dialog');
    const selected = await open({
      directory: true,
      multiple: false,
    });
    return typeof selected === 'string' ? selected : null;
  } else {
    const { selectFolder: mockSelectFolder } = await import('./mockTauri');
    return mockSelectFolder();
  }
};

export const readDirectory = async (path: string): Promise<ImageFile[]> => {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/tauri');
    return await invoke('read_directory', { path });
  } else {
    const { readDirectory: mockReadDirectory } = await import('./mockTauri');
    return mockReadDirectory(path);
  }
};

export const loadTagsForImage = async (imagePath: string): Promise<string[]> => {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/tauri');
    return await invoke('load_tags_for_image', { imagePath });
  } else {
    const { loadTagsForImage: mockLoadTagsForImage } = await import('./mockTauri');
    return mockLoadTagsForImage(imagePath);
  }
};

export const saveTagsForImage = async (imagePath: string, tags: string[]): Promise<void> => {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/tauri');
    await invoke('save_tags_for_image', { imagePath, tags });
  } else {
    const { saveTagsForImage: mockSaveTagsForImage } = await import('./mockTauri');
    await mockSaveTagsForImage(imagePath, tags);
  }
};

export const getImageSrc = (filePath: string): string => {
  if (isTauri) {
    return filePath;
  } else {
    const mockImages: { [key: string]: string } = {
      '/mock/sample1.jpg': 'https://via.placeholder.com/400x400/4CAF50/FFFFFF?text=Sample1',
      '/mock/sample2.png': 'https://via.placeholder.com/400x400/2196F3/FFFFFF?text=Sample2',
      '/mock/sample3.gif': 'https://via.placeholder.com/400x400/FF9800/FFFFFF?text=Sample3'
    };
    
    return mockImages[filePath] || 'https://via.placeholder.com/400x400/9E9E9E/FFFFFF?text=No+Image';
  }
};