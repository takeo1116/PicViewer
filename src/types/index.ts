export interface ImageFile {
  path: string;
  name: string;
  size: number;
  tags: string[];
  sourceUrl?: string;
}

export interface ImageMetadata {
  tags: string[];
  sourceUrl?: string;
}

export interface MetadataStore {
  [filename: string]: ImageMetadata;
}