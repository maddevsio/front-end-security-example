import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: process.env.PORT || 3000,
    // NOTICE: without valid TLS certificate https server will not be considered safe by browsers
    https: process.env.HTTPS || true,
    proxy: {
      '/api': {
        target: process.env.API_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
