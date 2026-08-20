import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    federation({
      // `name` is the container's identity; the host must reference this exact
      // string when it resolves `mfe1/Header`.
      name: 'mfe1',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/Header.jsx',
      },
      // A remote has to declare the same shared dependencies as the host, or it
      // loads its own React instead of consuming the one already on the page.
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 5174,
    cors: true,
  },
  preview: {
    port: 5174,
    cors: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
