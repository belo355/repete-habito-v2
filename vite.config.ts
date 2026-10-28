import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const MINIMUM_COVERAGE_PERCENT = 80;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/types/**', 'src/**/*.test.{ts,tsx}'],
      thresholds: {
        lines: MINIMUM_COVERAGE_PERCENT,
        functions: MINIMUM_COVERAGE_PERCENT,
        branches: MINIMUM_COVERAGE_PERCENT,
        statements: MINIMUM_COVERAGE_PERCENT,
      },
    },
  },
});
