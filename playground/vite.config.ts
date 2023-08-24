import path from 'path'

import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

function resolve(p: string) {
  return path.resolve(__dirname, p)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), UnoCSS({})],
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: { vue: ['vue'], dagre: ['dagre'], x6: ['@antv/x6'] }
      }
    }
  },
  server: {
    host: '0.0.0.0'
  }
})
