/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/brain-/',
  plugins: [react()],
  test: { environment: 'node', include: ['src/tests/**/*.test.ts'] },
});
