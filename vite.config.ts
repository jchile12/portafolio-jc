import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// Load HTTPS certs only if they exist (local dev)
const certPath = "./certs/192.168.1.10+2.pem";
const keyPath = "./certs/192.168.1.10+2-key.pem";
const hasLocalCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/portafolio-jc/",
  server: {
    host: true,
    port: 8080,
    ...(hasLocalCerts && {
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
    }),
    hmr: {
      overlay: false,
    },
    proxy: {
      '/r2-videos': {
        target: 'https://pub-e6e7daf16b12442e8face05aa72e9a27.r2.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/r2-videos/, ''),
      },
    },
  },
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
