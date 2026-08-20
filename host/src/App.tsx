import { lazy, Suspense, useEffect, useState } from 'react'
import { createLogger, LoadingSpinner } from 'shared'
import styles from './App.module.css'

const log = createLogger('host')

const RemoteHeader = lazy(() => import('mfe1/Header'))

function App() {
  const [remoteError, setRemoteError] = useState<string | null>(null)

  useEffect(() => {
    // Surface an unreachable microfrontend as a message rather than letting
    // the lazy import reject into an unhandled rejection.
    import('mfe1/Header').catch((error: unknown) => {
      log.error('Could not load mfe1/Header', error)
      setRemoteError(error instanceof Error ? error.message : String(error))
    })
  }, [])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Host Application Shell</h1>
        <p className={styles.description}>
          The section below is a separate React application, loaded over Module Federation.
        </p>
      </header>

      <main>
        <section className={styles.slot}>
          {remoteError ? (
            <div role="alert" className={styles.error}>
              <h2>Could not load the microfrontend</h2>
              <p>{remoteError}</p>
              <p>Check that mfe1 is running on port 5174.</p>
            </div>
          ) : (
            <Suspense fallback={<LoadingSpinner text="Loading header…" />}>
              <RemoteHeader />
            </Suspense>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
