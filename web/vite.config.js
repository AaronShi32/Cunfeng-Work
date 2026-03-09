import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
    },
    outDir: 'dist',
  },
  server: {
    // Don't apply SPA fallback to /blog paths - serve them as static files
    middlewareMode: false,
  },
  appType: 'spa',
})
