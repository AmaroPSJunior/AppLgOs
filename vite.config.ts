import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      legacy({
        targets: ['chrome > 38', 'safari > 7'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderModernChunks: false
      })
    ],
    base: "./",
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      target: 'es5',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      sourcemap: false,
      cssCodeSplit: false,
      cssTarget: 'chrome38',
      terserOptions: {
        ecma: 5,
        compress: {
          drop_console: false,
          passes: 3,
          keep_fnames: true
        },
        mangle: true,
        safari10: true
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
