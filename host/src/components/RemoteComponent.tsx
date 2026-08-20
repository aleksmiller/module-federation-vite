import { lazy, Suspense, useCallback, useMemo, useState, type ComponentType } from 'react'
import { LoadingSpinner } from 'shared'
import { ErrorBoundary } from './ErrorBoundary'
import { loadRemoteModule } from '../remotes/loadRemoteModule'
import type { RemoteDescriptor } from '../remotes/manifest'

interface RemoteComponentProps {
  remote: RemoteDescriptor
}

/**
 * Mounts one federated component.
 *
 * `React.lazy` handles the load-once-and-cache behaviour and `Suspense` handles
 * the pending state, so there is no loading flag to keep in sync. The lazy
 * wrapper is memoised on the remote's *fields* rather than on an imported
 * function: memoising on a callback identity would re-import (and reset the
 * remote's internal state) on every render of the parent.
 */
export function RemoteComponent({ remote }: RemoteComponentProps) {
  const [attempt, setAttempt] = useState(0)
  const { entry, scope, module, id, name } = remote

  const LazyRemote = useMemo(
    () =>
      lazy(() =>
        loadRemoteModule<{ default: ComponentType }>({
          remote: { id, name, entry, scope, module },
          force: attempt > 0,
        }),
      ),
    [id, name, entry, scope, module, attempt],
  )

  const handleRetry = useCallback(() => setAttempt((n) => n + 1), [])

  return (
    <ErrorBoundary key={attempt} label={name} onRetry={handleRetry}>
      <Suspense fallback={<LoadingSpinner text={`Loading ${name}…`} />}>
        <LazyRemote />
      </Suspense>
    </ErrorBoundary>
  )
}
