import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'shared/styles.css'
import App from './App'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Expected a #root element in index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
