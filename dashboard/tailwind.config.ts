import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Matches spatial engine severity levels
        severity: {
          warning: '#f59e0b',
          error: '#ef4444',
          pass: '#10b981',
          unknown: '#6b7280',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
