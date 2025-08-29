import { defineVitestConfig } from '@nuxt/test-utils/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as pathResolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname;
const srcDir = pathResolve(rootDir, 'src');

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['tests/**/*.spec.ts'],
    exclude: ['e2e/**', 'playwright.config.ts'],
  },
  resolve: {
    alias: {
      // Nuxt-style aliases
      '~~': rootDir,
      '@@': rootDir,
      '~': srcDir,
      '@': srcDir,
    },
  },
});
