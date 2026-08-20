import { createConfig } from '../vite.factory'

export default createConfig({
  port: 5175,
  federation: {
    name: 'mfe2',
    exposes: {
      './Content': './src/Content.tsx',
    },
  },
})
