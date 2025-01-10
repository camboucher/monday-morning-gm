import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vercel from 'vite-plugin-vercel';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

