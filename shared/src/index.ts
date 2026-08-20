// Public surface of the `shared` workspace. Consumers import from 'shared';
// the global stylesheet is a separate entry point ('shared/styles.css') because
// it is a side effect, not a value, and each app imports it exactly once.
export { LoadingSpinner } from './components/LoadingSpinner'
export type { LoadingSpinnerProps, SpinnerSize } from './components/LoadingSpinner'
export { createLogger } from './utils/logger'
export type { Logger } from './utils/logger'
