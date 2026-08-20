let markReady: () => void

/**
 * Resolves once the Module Federation runtime has been initialised.
 *
 * @module-federation/vite injects its own entry script that initialises the
 * runtime and registers this app's shared dependencies. That happens
 * asynchronously, in parallel with the React entry point — so application code
 * that loads a remote is in a race with it. Losing that race is not a delay but
 * a correctness bug: a remote whose container initialises before the host has
 * registered React into the share scope will resolve React itself, and two
 * Reacts on one page means "Invalid hook call" on the first hook.
 *
 * The federation runtime plugin next to this file resolves the promise from
 * inside `init`, which is the moment the instance exists and the host's shared
 * modules are being registered.
 */
export const federationReady = new Promise<void>((resolve) => {
  markReady = resolve
})

/** Called by the federation runtime plugin. Not part of the app's API. */
export function markFederationReady(): void {
  markReady()
}
