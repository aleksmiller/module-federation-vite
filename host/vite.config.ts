import { fileURLToPath } from 'node:url'
import { createConfig } from '../vite.factory'

// Absolute on purpose: the federation plugin embeds this specifier verbatim in
// a generated module that does not sit next to this file, so a relative path
// would resolve against the wrong directory.
const federationReadyPlugin = fileURLToPath(
  new URL('./src/remotes/federationRuntimePlugin.ts', import.meta.url),
)

// The host declares no `remotes`. Containers are discovered at runtime from a
// manifest (see src/remotes/), so microfrontends can be deployed and re-pointed
// without rebuilding the shell.
export default createConfig({
  port: 5173,
  federation: {
    name: 'host',
    runtimePlugins: [federationReadyPlugin],
  },
})
