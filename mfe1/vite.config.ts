import { createConfig } from '../vite.factory'

export default createConfig({
  port: 5174,
  federation: {
    // `name` is the container's identity; the host must reference this exact
    // string when it resolves `mfe1/Header`.
    name: 'mfe1',
    exposes: {
      './Header': './src/Header.tsx',
    },
  },
})
