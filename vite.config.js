// vite.config.js
import { defineConfig } from 'vite';
import cors from 'cors';

export default defineConfig({
  server: {
    middleware: [
      cors(),
    ],
  },
});