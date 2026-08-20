import { useState } from 'react'
import styles from './Content.module.css'

/**
 * Exposed to the host as `mfe2/Content` (see vite.config.ts).
 *
 * The counter exists to make a specific property visible: the host can
 * re-render freely without this state being lost, because the host memoises
 * its lazy wrapper on the remote's identity rather than on a callback.
 */
export default function Content() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Microfrontend 2 Content Component</h2>
      <p className={styles.text}>This component owns its own state.</p>
      <p className={styles.text}>
        Button clicked: <strong className={styles.count}>{count}</strong> times
      </p>
      <button type="button" className="button" onClick={() => setCount((n) => n + 1)}>
        Click me!
      </button>
    </div>
  )
}
