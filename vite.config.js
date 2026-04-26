import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdf-lib') || id.includes('pdfjs-dist')) return 'pdf';
          if (id.includes('docx') || id.includes('mammoth')) return 'office';
          if (id.includes('react') || id.includes('react-router-dom') || id.includes('react-helmet-async')) return 'vendor';
        }
      }
    }
  },
})
