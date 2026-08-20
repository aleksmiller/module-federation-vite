import styles from './LoadingSpinner.module.css'

export type SpinnerSize = 'small' | 'medium' | 'large'

export interface LoadingSpinnerProps {
  size?: SpinnerSize
  /** Announced to assistive tech and shown beneath the spinner. */
  text?: string
}

export function LoadingSpinner({ size = 'medium', text = 'Loading…' }: LoadingSpinnerProps) {
  return (
    // `role="status"` + `aria-live` means screen readers announce the change
    // without the spinner itself stealing focus.
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      {text && <p className={styles.label}>{text}</p>}
    </div>
  )
}
