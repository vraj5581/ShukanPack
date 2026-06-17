import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/shukanpack/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
