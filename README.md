# Module Federation Vite

A reference template for a React microfrontend architecture built on Vite 7 and
Module Federation. It is deliberately small, but every piece is set up the way
you would want it in a real system: remotes resolved at runtime, one shared
React, scoped CSS, and a build that fails on type errors.

## Architecture

| Workspace | Port | Role                                                               |
| --------- | ---- | ------------------------------------------------------------------ |
| `host`    | 5173 | Shell. Discovers and mounts microfrontends; owns no remote config. |
| `mfe1`    | 5174 | Exposes `./Header`.                                                |
| `mfe2`    | 5175 | Exposes `./Content`.                                               |
| `shared`  | –    | Components, design tokens and utilities used by all of the above.  |

Each app also runs standalone: open <http://localhost:5174> to develop `mfe1`
on its own, without the shell.

### Runtime remote resolution

The host's Vite config declares **no `remotes`**. Nothing about the
microfrontends is compiled into the shell. Instead the host fetches
[`host/public/mfe-manifest.json`](host/public/mfe-manifest.json) at boot:

```json
{
  "remotes": [
    {
      "id": "header",
      "name": "Header (MFE1)",
      "scope": "mfe1",
      "module": "./Header",
      "entry": "http://localhost:5174/remoteEntry.js"
    }
  ]
}
```

and loads each entry through
[`loadRemoteModule`](host/src/remotes/loadRemoteModule.ts), which registers the
container with the Module Federation runtime and resolves the exposed module.

The payoff is that **microfrontends can be deployed, re-pointed, added or
removed by editing one JSON file** — no rebuild of the host. That is the whole
reason to reach for Module Federation instead of a monolith; wiring remote URLs
into the host's bundle at build time gives most of the complexity and none of
the benefit.

`scope` must match the `name` in the remote's `federation()` config, and
`module` must be a key from its `exposes` map.

### Waiting for the runtime

`@module-federation/vite` initialises the federation runtime from an entry
script it injects into the page, and that initialisation runs concurrently with
the React entry point. Application code that loads a remote is therefore in a
race with it — and losing is not a delay but a correctness bug: a container that
initialises before the host has registered React into the share scope resolves
its own React, and two Reacts on one page means `Invalid hook call` on the first
hook.

So loading waits on [`federationReady`](host/src/remotes/federationReady.ts), a
promise resolved from a federation **runtime plugin** (registered via
`runtimePlugins` in [`host/vite.config.ts`](host/vite.config.ts)) at the moment
the runtime instance is created.

### Shared dependencies

React and React DOM are shared singletons, declared once in
[`vite.factory.ts`](vite.factory.ts) so every app declares the same set. A
remote that does not declare them loads its own React and breaks the moment an
exposed component uses a hook.

Unlike webpack, subpaths do not need listing: the Vite plugin expands `react` to
cover `react/jsx-runtime` and `react-dom` to cover `react-dom/client`. Webpack's
Module Federation does not, which is why its configs list them by hand.

### Retrying a failed remote

A remote entry is an ES module, and the browser records a module that failed to
fetch as permanently failed in its module map. Every later `import()` of that
exact URL rejects from cache without touching the network. Retrying an
unreachable microfrontend at the same URL therefore cannot succeed even after it
comes back up, so Retry re-registers the container under a cache-busted URL.

## Getting started

Requires Node ≥ 24 (see [`.nvmrc`](.nvmrc)).

```bash
npm install   # installs every workspace from the single root lockfile
npm run dev   # starts mfe1, mfe2 and host together
```

Then open <http://localhost:5173>.

Because remotes are resolved at runtime, the host starts fine on its own — each
microfrontend that is not running degrades to an inline error with a working
Retry button, and the rest of the page keeps functioning.

## Scripts

Run from the repo root:

| Script               | Does                                                      |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | All three dev servers, with prefixed interleaved output.  |
| `npm run build`      | Production build of every app (remotes first, then host). |
| `npm run preview`    | Serves the production builds on the same ports.           |
| `npm run type-check` | `tsc --noEmit` in every workspace, including `shared`.    |
| `npm run lint`       | ESLint over the whole repo.                               |
| `npm run format`     | Prettier write. `format:check` for the read-only version. |
| `npm run clean`      | Removes every `dist/`.                                    |
| `npm run verify`     | Everything CI runs: format, lint, types, build.           |

Target one workspace with `npm run <script> --workspace=mfe1`.

## Conventions

**Workspaces.** npm workspaces with a single root lockfile. Build tooling is a
root `devDependency`; only genuine runtime dependencies (`react`, `react-dom`,
`shared`) live in the individual apps.

**One Vite config.** [`vite.factory.ts`](vite.factory.ts) holds the build; each
app's `vite.config.ts` supplies only its port and federation wiring. Three build
settings there are not optional: `target: 'esnext'` for top-level await in
remote entries, `modulePreload: false` because preload links are stamped with
the building app's own origin, and `cssCodeSplit: false` because a federated
chunk arrives without a `<link>` for its stylesheet.

**CSS.** Component styles are CSS Modules (`*.module.css`), so class names from
independently built and deployed microfrontends cannot collide. The single
global layer is [`shared/src/styles/common.css`](shared/src/styles/common.css) —
design tokens, a reset, and a `.button` class — imported once per app via
`import 'shared/styles.css'`.

**Type safety.** esbuild strips types without checking them, so `tsc --noEmit`
runs separately per workspace and in CI. A green build says nothing about types.

**Errors.** Every remote is wrapped in its own
[`ErrorBoundary`](host/src/components/ErrorBoundary.tsx). One failing
microfrontend cannot take down the shell, and Retry re-attempts the import
rather than reloading the page.

## Deploying

1. `npm run build` produces `host/dist`, `mfe1/dist`, `mfe2/dist`.
2. Serve each `dist/` from its own origin.
3. Replace `mfe-manifest.json` in the host's deployment with one pointing at the
   real remote URLs. This is the only step that has to change per environment.

Remote entries are ES modules fetched cross-origin, so unlike classic script
tags they are subject to CORS — serve `remoteEntry.js` with permissive CORS if
it lives on a different origin than the shell. The dev and preview servers
already do this.

> **Note:** loading and executing JavaScript from another origin at runtime
> means that origin can do anything your shell can. Only list remotes you
> control, and consider a `Content-Security-Policy` with an explicit
> `script-src` allowlist in production.

## Known gaps

This is a template, not a finished product. Deliberately not included:

- **Tests.** No test runner is configured. Vitest plus Testing Library would be
  the natural fit.
- **Routing.** A single-page shell with no router. Sharing route state across
  microfrontends is its own design problem.
- **Cross-microfrontend communication.** The MFEs are fully independent; there
  is no shared store or event bus.

## Further reading

- [Module Federation](https://module-federation.io/)
- [@module-federation/vite](https://github.com/module-federation/vite)
- [React error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
