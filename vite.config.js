import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/a/',
  server: {
    proxy: {
      // Forward all /api requests to the Express server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // SSE requires no buffering
        configure: (proxy) => {
          proxy.on('proxyReq', (_, req) => {
            if (req.url?.includes('/events/stream')) {
              req.setTimeout(0)
            }
          })
        },
      },
    },
  },
})
