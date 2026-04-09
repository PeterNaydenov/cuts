import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  server: {
    port: 4174,
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist-test')
  }
})