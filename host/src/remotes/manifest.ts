import { createLogger } from 'shared'

const log = createLogger('host:manifest')

/** One microfrontend the shell should mount, as described by the manifest. */
export interface RemoteDescriptor {
  /** Stable key for React lists and for the retry counter. */
  id: string
  /** Human-readable name, used in loading and error messages. */
  name: string
  /** Must match the `name` in the remote's federation config. */
  scope: string
  /** Key from the remote's `exposes` map, e.g. `'./Header'`. */
  module: string
  /** Absolute URL of the remote's `remoteEntry.js`. */
  entry: string
}

/**
 * Where the shell looks for its remote list. The file is served as a static
 * asset rather than compiled in, so a deployment can re-point microfrontends by
 * replacing this one file — no rebuild of the host.
 */
export const MANIFEST_URL = '/mfe-manifest.json'

const REQUIRED_FIELDS = ['id', 'name', 'scope', 'module', 'entry'] as const

function isRemoteDescriptor(value: unknown): value is RemoteDescriptor {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return REQUIRED_FIELDS.every((key) => typeof candidate[key] === 'string' && candidate[key] !== '')
}

/**
 * Fetches and validates the remote manifest. The manifest is external
 * configuration, so it is checked rather than trusted: a malformed entry is
 * dropped with a warning instead of blowing up the whole shell.
 */
export async function loadManifest(signal?: AbortSignal): Promise<RemoteDescriptor[]> {
  const response = await fetch(MANIFEST_URL, { signal })
  if (!response.ok) {
    throw new Error(`Manifest request to ${MANIFEST_URL} failed with ${response.status}`)
  }

  const payload: unknown = await response.json()
  const entries =
    typeof payload === 'object' &&
    payload !== null &&
    Array.isArray((payload as { remotes?: unknown }).remotes)
      ? (payload as { remotes: unknown[] }).remotes
      : []

  const valid = entries.filter(isRemoteDescriptor)
  if (valid.length !== entries.length) {
    log.warn(`Ignored ${entries.length - valid.length} malformed entries in ${MANIFEST_URL}`)
  }
  return valid
}
