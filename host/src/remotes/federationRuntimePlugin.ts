import type { ModuleFederationRuntimePlugin } from '@module-federation/runtime/types'
import { markFederationReady } from './federationReady'

/**
 * Registered through `runtimePlugins` in vite.config.ts, which is the supported
 * way to observe the federation runtime's lifecycle.
 *
 * `init` fires synchronously while the runtime instance is being created, so
 * anything waiting on `federationReady` resumes on the following microtask —
 * by which point the host's shared modules are in the share scope.
 */
export default function federationReadyPlugin(): ModuleFederationRuntimePlugin {
  return {
    name: 'host-federation-ready',
    init() {
      markFederationReady()
    },
  }
}
