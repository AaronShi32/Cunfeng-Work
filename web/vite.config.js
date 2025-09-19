import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'public/home.html'),
        microsoft: resolve(__dirname, 'public/microsoft.html'),
      },
    },
    outDir: 'dist',
  },
})
