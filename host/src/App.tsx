import { LoadingSpinner } from 'shared'
import { RemoteComponent } from './components/RemoteComponent'
import { useManifest } from './remotes/useManifest'
import { MANIFEST_URL } from './remotes/manifest'
import styles from './App.module.css'

function App() {
  const manifest = useManifest()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Host Application Shell</h1>
        <p className={styles.description}>
          The sections below are separate React applications, discovered at runtime from{' '}
          <code>{MANIFEST_URL}</code> and loaded over Module Federation.
        </p>
      </header>

      <main>
        {manifest.status === 'loading' && <LoadingSpinner text="Discovering microfrontends…" />}

        {manifest.status === 'error' && (
          <div role="alert" className={styles.error}>
            <h2>Could not load the microfrontend manifest</h2>
            <p>{manifest.error.message}</p>
          </div>
        )}

        {manifest.status === 'ready' &&
          (manifest.remotes.length === 0 ? (
            <p>No microfrontends are configured.</p>
          ) : (
            manifest.remotes.map((remote) => (
              <section key={remote.id} className={styles.slot}>
                <RemoteComponent remote={remote} />
              </section>
            ))
          ))}
      </main>

      <footer className={styles.footer}>This footer is rendered by the host.</footer>
    </div>
  )
}

export default App
