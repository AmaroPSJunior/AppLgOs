import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      legacy({
        targets: ['chrome > 38', 'safari > 7'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderModernChunks: false // Reduz complexidade de script
      })
    ],
    base: "./",
    build: {
      target: 'chrome38',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      sourcemap: false,
      cssCodeSplit: false,
      cssTarget: 'chrome38',
      terserOptions: {
        compress: {
          drop_console: false,
          pure_funcs: [],
          passes: 2
        },
        mangle: true,
        safari10: true
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
    }
  };
});
