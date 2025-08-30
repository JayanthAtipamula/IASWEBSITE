import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from 'vite-plugin-vercel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    vercel({
      // Configure SSR with proper server bundle inclusion
      expiration: 25,
      isr: {
        // Enable ISR for better performance
        expiration: 60
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  publicDir: 'public',
  ssr: {
    noExternal: ['react-helmet'],
  },
});
