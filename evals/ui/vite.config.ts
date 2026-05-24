import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3005,
    proxy: {
      '/server': {
        target: 'http://localhost:3006',
        rewrite: (p: string) => p.replace(/^\/server/, ''),
      },
    },
  },
});
