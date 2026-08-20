import { Component, type ErrorInfo, type ReactNode } from 'react'
import { createLogger } from 'shared'
import styles from './ErrorBoundary.module.css'

const log = createLogger('host')

interface ErrorBoundaryProps {
  children: ReactNode
  /** Shown in the fallback so the user knows which microfrontend failed. */
  label: string
  /**
   * Invoked by the Retry button. Mount the boundary under a changing `key` so
   * its error state resets when the parent retries.
   */
  onRetry?: () => void
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Keeps one failing microfrontend from taking down the shell. Every remote is
 * wrapped in its own boundary, so a broken MFE degrades to an inline message
 * while the rest of the page carries on.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In a real deployment this is where you would forward to an error
    // reporting service, tagged with `this.props.label`.
    log.error(`"${this.props.label}" failed`, error, errorInfo.componentStack)
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div role="alert" className={styles.error}>
        <h3 className={styles.title}>{this.props.label} is unavailable</h3>
        <p className={styles.message}>
          The rest of the page is still working. Check that the microfrontend is running and
          reachable.
        </p>
        {/* Stack traces help locally; in production they are noise at best. */}
        {import.meta.env.DEV && (
          <details className={styles.details}>
            <summary>Error details</summary>
            <pre>{error.stack ?? String(error)}</pre>
          </details>
        )}
        {this.props.onRetry && (
          <button type="button" className="button" onClick={this.props.onRetry}>
            Try again
          </button>
        )}
      </div>
    )
  }
}
