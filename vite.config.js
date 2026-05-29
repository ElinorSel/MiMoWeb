import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Pre-compressed Unity files must not be gzip-compressed again by the dev server. */
function unityBuildHeaders() {
  const gzipAssets = [
    {
      match: (p) => p.includes('web build 2.data'),
      type: 'application/gzip',
    },
    {
      match: (p) => p.includes('web build 2.framework.js'),
      type: 'application/javascript',
    },
    {
      match: (p) => p.includes('web build 2.wasm'),
      type: 'application/wasm',
    },
  ];

  const applyHeaders = (req, res, next) => {
    const path = (req.url ?? '').split('?')[0];
    const asset = gzipAssets.find((entry) => entry.match(path));

    if (asset) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Type', asset.type);
    }

    next();
  };

  return {
    name: 'unity-build-headers',
    configureServer(server) {
      server.middlewares.use(applyHeaders);
    },
    configurePreviewServer(server) {
      server.middlewares.use(applyHeaders);
    },
  };
}

export default defineConfig({
  plugins: [unityBuildHeaders(), react()],
  server: {
    compress: false,
  },
  preview: {
    compress: false,
  },
});
