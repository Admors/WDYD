import { defineConfig } from 'vite';

export default defineConfig({
  // Force le sous-dossier GitHub Pages exact
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