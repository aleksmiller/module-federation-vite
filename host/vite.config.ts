import { createConfig } from '../vite.factory'

export default createConfig({
  port: 5173,
  federation: {
    name: 'host',
    remotes: {
      mfe1: {
        type: 'module',
        name: 'mfe1',
        entry: 'http://localhost:5174/remoteEntry.js',
        entryGlobalName: 'mfe1',
        shareScope: 'default',
      },
    },
  },
})
