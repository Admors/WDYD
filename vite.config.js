import { defineConfig } from 'vite';

export default defineConfig({
  base: '/WDYD/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },

  test: {
    environment: 'happy-dom',
    globals: true
  }
});