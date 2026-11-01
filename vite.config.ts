import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function pwaAssetsPlugin(): Plugin {
  const handler = (req: any, res: any, next: any) => {
    // CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    const rawUrl = req.url || '';
    const cleanUrl = rawUrl.split('?')[0].replace(/\/+$/, '') || '/';

    // Service Worker: /sw.js
    if (cleanUrl === '/sw.js' || cleanUrl === '/public/sw.js') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Service-Worker-Allowed', '/');
      const swPath = path.resolve(process.cwd(), 'public/sw.js');
      if (fs.existsSync(swPath)) {
        res.end(fs.readFileSync(swPath));
        return;
      }
    }

    // Manifest JSON: /manifest.json (and fallbacks)
    if (
      cleanUrl === '/manifest.json' ||
      cleanUrl === '/public/manifest.json' ||
      cleanUrl === '/manifest.webmanifest' ||
      cleanUrl === '/site.webmanifest'
    ) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
      const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
      if (fs.existsSync(manifestPath)) {
        res.end(fs.readFileSync(manifestPath));
        return;
      }
    }

    // Static Icons
    if (
      cleanUrl === '/icon-192x192.png' ||
      cleanUrl === '/icon-512x512.png' ||
      cleanUrl === '/apple-touch-icon.png' ||
      cleanUrl === '/favicon.ico'
    ) {
      const fileName = cleanUrl.replace(/^\//, '');
      const iconPath = path.resolve(process.cwd(), `public/${fileName}`);
      if (fs.existsSync(iconPath)) {
        res.setHeader('Content-Type', cleanUrl.endsWith('.ico') ? 'image/x-icon' : 'image/png');
        res.end(fs.readFileSync(iconPath));
        return;
      }
    }

    next();
  };

  return {
    name: 'serve-pwa-assets',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(() => {
  return {
    appType: 'spa' as const, // Enables full SPA history fallback for all routes
    publicDir: path.resolve(process.cwd(), 'public'),
    plugins: [
      react(),
      tailwindcss(),
      pwaAssetsPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      cors: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      cors: true,
      port: 3000,
    },
  };
});
