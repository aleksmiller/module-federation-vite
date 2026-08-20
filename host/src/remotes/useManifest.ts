import { useEffect, useState } from 'react'
import { loadManifest, type RemoteDescriptor } from './manifest'

type ManifestState =
  | { status: 'loading' }
  | { status: 'ready'; remotes: RemoteDescriptor[] }
  | { status: 'error'; error: Error }

/** Fetches the remote manifest once on mount, aborting if the shell unmounts. */
export function useManifest(): ManifestState {
  const [state, setState] = useState<ManifestState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    loadManifest(controller.signal)
      .then((remotes) => setState({ status: 'ready', remotes }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({ status: 'error', error: error as Error })
      })

    return () => controller.abort()
  }, [])

  return state
}
