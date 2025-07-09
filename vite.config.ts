import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import picsPlugin from './vite-plugin-pics.js'

export default defineConfig({
  plugins: [react(), picsPlugin()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
    fs: {
      allow: ['..']
    }
  },
  publicDir: 'public',
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.bmp', '**/*.webp'],
})