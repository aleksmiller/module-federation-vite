import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        mfe1: {
          type: 'module',
          name: 'mfe1',
          entry: 'http://localhost:5174/remoteEntry.js',
          entryGlobalName: 'mfe1',
          shareScope: 'default',
        },
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 5173,
    cors: true,
  },
  preview: {
    port: 5173,
    cors: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
