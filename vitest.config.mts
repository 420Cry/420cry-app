import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    conditions: ['import', 'browser'],
  },
  test: {
    environment: 'jsdom',
    deps: {
      inline: ['@420cry/420cry-lib'],
    },
  },
})
