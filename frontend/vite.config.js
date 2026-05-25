import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://goal-tracker-app-71a8.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
