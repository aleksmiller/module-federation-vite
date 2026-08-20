import styles from './Header.module.css'

/**
 * Exposed to the host as `mfe1/Header` (see vite.config.ts).
 *
 * Exposed components must default-export, because that is what the host's
 * `React.lazy` wrapper resolves.
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.emoji} aria-hidden="true">
          🚀
        </span>
        Microfrontend 1 Header Component
      </h1>
    </header>
  )
}
