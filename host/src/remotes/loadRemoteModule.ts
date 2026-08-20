import { loadRemote, registerRemotes } from '@module-federation/runtime'
import { federationReady } from './federationReady'
import type { RemoteDescriptor } from './manifest'

/**
 * Loads one module from one microfrontend.
 *
 * The host declares no `remotes` at build time, so nothing about the
 * microfrontends is baked into its bundle. A container is registered with the
 * federation runtime the first time something asks for it, using values that
 * came out of the manifest at boot.
 */

interface LoadRemoteModuleOptions {
  remote: RemoteDescriptor
  /**
   * Re-register the container under a fresh URL. Set on a retry; see
   * `bustCache` for why the URL has to change.
   */
  force?: boolean
}

const registered = new Set<string>()

/**
 * Returns the entry URL with a cache-busting parameter.
 *
 * A remote entry is an ES module, and the browser records a module that failed
 * to fetch as permanently failed in its module map. Every later `import()` of
 * that exact URL rejects from cache without touching the network, so retrying
 * an unreachable microfrontend at the same URL can never succeed — not after
 * the remote comes back up, not ever, short of a page reload. A different URL
 * is a different module map entry.
 */
function bustCache(entry: string): string {
  const url = new URL(entry, window.location.href)
  url.searchParams.set('t', Date.now().toString(36))
  return url.toString()
}

export async function loadRemoteModule<T>({
  remote,
  force = false,
}: LoadRemoteModuleOptions): Promise<T> {
  await federationReady

  const key = `${remote.scope}@${remote.entry}`
  if (force || !registered.has(key)) {
    registerRemotes(
      [
        {
          name: remote.scope,
          entry: force ? bustCache(remote.entry) : remote.entry,
          // Vite builds ES modules, so a remote entry is imported rather than
          // injected as a classic script.
          type: 'module',
          entryGlobalName: remote.scope,
          shareScope: 'default',
        },
      ],
      { force },
    )
    registered.add(key)
  }

  // The runtime addresses a module as `<scope>/<expose>`, where the expose is
  // the remote's `exposes` key without its leading './'.
  const id = `${remote.scope}/${remote.module.replace(/^\.\//, '')}`
  const module = await loadRemote<T>(id)
  if (!module) {
    throw new Error(`Remote "${remote.scope}" at ${remote.entry} does not expose ${remote.module}`)
  }
  return module
}
