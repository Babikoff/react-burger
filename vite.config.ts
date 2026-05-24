import react from '@vitejs/plugin-react';
// import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // checker({
    //   typescript: true,
    // }),
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  base: '',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
  },
  server: {
    open: true,
  },
  // resolve: {
  //   alias: {
  //     '@components': path.resolve(__dirname, './src/components'),
  //     '@contexts': path.resolve(__dirname, './src/contexts'),
  //     '@hoc': path.resolve(__dirname, './src/hoc'),
  //     '@hooks': path.resolve(__dirname, './src/hooks'),
  //     '@pages': path.resolve(__dirname, './src/pages'),
  //     '@services': path.resolve(__dirname, './src/services'),
  //     '@utils': path.resolve(__dirname, './src/utils'),
  //   },
  // },
});
