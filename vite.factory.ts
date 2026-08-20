import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { defineConfig, type UserConfig } from 'vite'

type FederationOptions = Parameters<typeof federation>[0]

/**
 * Dependencies every app in this repo shares, so that a microfrontend consumes
 * the React already on the page instead of loading a second one. Two Reacts
 * means "Invalid hook call" the first time an exposed component uses a hook.
 *
 * Subpaths do not need listing: the plugin expands `react` to cover
 * `react/jsx-runtime` and `react-dom` to cover `react-dom/client`. (Webpack
 * does not, which is why its Module Federation configs list them by hand.)
 */
const SHARED_DEPENDENCIES = ['react', 'react-dom']

interface AppOptions {
  /** Dev-server and preview-server port. */
  port: number
  /** Module Federation wiring — `name`, plus `exposes` or `remotes`. */
  federation: FederationOptions
}

/**
 * Every federated app in this repo is built the same way. The only things that
 * differ are its port and its Module Federation wiring, so those are the only
 * things this factory takes — Vite infers the rest from the config file's own
 * directory.
 */
export function createConfig({ port, federation: federationOptions }: AppOptions): UserConfig {
  return defineConfig({
    plugins: [
      react(),
      federation({
        filename: 'remoteEntry.js',
        shared: SHARED_DEPENDENCIES,
        ...federationOptions,
      }),
    ],

    server: {
      port,
      // A host on one port loads assets from remotes on others. Cross-origin
      // module imports are subject to CORS, unlike classic script tags.
      cors: true,
      // Fail instead of silently moving to the next free port: the remote's
      // URL is configuration elsewhere, so a shifted port is a broken app.
      strictPort: true,
    },

    preview: {
      port,
      cors: true,
      strictPort: true,
    },

    build: {
      // Remote entries are ES modules that use top-level await.
      target: 'esnext',
      // Preload links are generated with the building app's own base URL, which
      // is the wrong origin for chunks the host will fetch from a remote.
      modulePreload: false,
      // A federated chunk carries no <link> for its stylesheet, so CSS has to
      // land in one file the app's own HTML already references.
      cssCodeSplit: false,
    },
  })
}
