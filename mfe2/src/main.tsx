import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'shared/styles.css'
import Content from './Content'

// Standalone mode: this only runs when mfe2 is opened directly on :5175.
const container = document.getElementById('root')
if (!container) {
  throw new Error('Expected a #root element in index.html')
}

createRoot(container).render(
  <StrictMode>
    <Content />
  </StrictMode>,
)
