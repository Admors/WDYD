import { defineConfig } from 'vite';

export default defineConfig({
  base: '/WDYD/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  },

  test: {
    environment: 'happy-dom',
    globals: true
  }
});