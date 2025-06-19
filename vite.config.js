import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isVercel = process.env.VERCEL === '1' // variabel env default di Vercel
  const base = isVercel ? '/' : '/klinik-frontend/'

  return {
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
