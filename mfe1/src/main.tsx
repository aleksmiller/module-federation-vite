import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'shared/styles.css'
import Header from './Header'

// Standalone mode: this only runs when mfe1 is opened directly on :5174. When
// the host consumes it, only ./Header is loaded — this file never executes.
const container = document.getElementById('root')
if (!container) {
  throw new Error('Expected a #root element in index.html')
}

createRoot(container).render(
  <StrictMode>
    <Header />
  </StrictMode>,
)
