import { defineConfig } from 'vite';
import path from 'path';

// iSCOUT immersive — Vite vanilla (Three.js + GSAP + Lenis)
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
