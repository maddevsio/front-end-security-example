import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert'
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 3000,
    // NOTICE: without valid TLS certificate https server will not be considered safe by browsers
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
});
