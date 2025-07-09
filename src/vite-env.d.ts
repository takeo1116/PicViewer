/// <reference types="vite/client" />

declare module 'virtual:pics-list' {
  const imageFiles: Array<{name: string, size: number}>;
  export default imageFiles;
}