// Modules exposed by the microfrontends. The host resolves these at runtime
// through Module Federation, so TypeScript has no way to discover them and no
// way to verify that the remote really exposes what is declared here — a typo
// surfaces as a runtime error, not a compile error.
declare module 'mfe1/Header' {
  import type { ComponentType } from 'react'

  const Header: ComponentType
  export default Header
}
