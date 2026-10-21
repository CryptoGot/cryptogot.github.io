import { defineConfig } from 'vite';

export default defineConfig({
  // Site utilisateur GitHub Pages (cryptogot.github.io) → servi à la racine
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: 'index.html',
        rapide: 'rapide.html'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
