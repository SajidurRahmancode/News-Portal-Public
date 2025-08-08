import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Match your server port
        changeOrigin: true,
      }
    }
  }
})
