/**
 * Exposed to the host as `mfe1/Header` (see vite.config.js).
 *
 * Exposed components must default-export, because that is what the host's
 * `React.lazy` wrapper resolves.
 */
export default function Header() {
  return (
    <header className="mfe1-header">
      <h1 className="mfe1-header-title">
        <span aria-hidden="true">🚀</span> Microfrontend 1 Header Component
      </h1>
    </header>
  )
}
