import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/styles.css',
        '**/eslint.config.js',
        '**/vite.config.ts',
        '**/main.tsx',
        '**/src/forms/UncontrolledForm.tsx',
        '**/src/forms/RHFForm.tsx',
        '**/src/forms/image.ts',
        '**/src/store/selectors.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
})
