import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: false,
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    fileParallelism: false,
    maxWorkers: 1,
  },
  plugins: [swc.vite()],
});
