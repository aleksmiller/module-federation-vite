// host
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:5001/remoteEntry.js",
          entryGlobalName: "remote",
          shareScope: "default",
        },
      },
      filename: "remoteEntry.js",
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
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