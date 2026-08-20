import { defineConfig } from 'vite';

export default defineConfig({
  // Racine par défaut pour le local (localhost:4173/)
  base: '/',

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