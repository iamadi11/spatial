import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows importing the spatial engine as '@engine'
      '@engine': path.resolve(__dirname, '../src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    resolve: {
      alias: {
        '@engine': path.resolve(__dirname, '../src'),
      },
    },
  },
})
