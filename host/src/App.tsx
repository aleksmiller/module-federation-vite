import { lazy, Suspense, useEffect, useState } from 'react'
import { createLogger, LoadingSpinner } from 'shared'
import './App.css'

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
    <div className="App">
      <header className="App-header">
        <h1>Host Application 🌐</h1>
        <p>This application is consuming a component from the remote microfrontend.</p>
        <hr style={{ width: '50%' }} />

        {remoteError ? (
          <div role="alert" style={{ color: 'red', padding: '20px' }}>
            <h3>Remote Loading Error:</h3>
            <p>{remoteError}</p>
            <p>Make sure the microfrontend is running on port 5174</p>
          </div>
        ) : (
          <Suspense fallback={<LoadingSpinner text="Loading header…" />}>
            <RemoteHeader />
          </Suspense>
        )}
      </header>
    </div>
  )
}

export default App
