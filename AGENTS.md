# Working in this repo

A Vite 7 Module Federation microfrontend template: an npm-workspaces monorepo of
`host` (the shell), `mfe1`/`mfe2` (remotes) and `shared` (common code).
No Next.js, no Tailwind, no SSR — plain React 19 + Vite.

Read the README first; it explains the runtime-manifest architecture, which is
the one non-obvious thing about this codebase.

## Before you finish

```bash
npm run verify   # format:check + lint + type-check + build
```

CI runs exactly this. esbuild strips types without checking them, so a build
passing locally proves nothing about type safety unless `type-check` ran.

A build passing also proves nothing about federation, which is wired at
runtime. Run `npm run dev` and load <http://localhost:5173> for anything that
touches remote loading, the share scope or the manifest.

## Conventions

- **TypeScript everywhere**, `strict` on. Function components; no `React.FC`.
- **Prettier owns formatting** — no semicolons, single quotes, 100 cols. Never
  hand-format; run `npm run format`.
- **Named exports**, except components exposed over Module Federation, which
  must default-export because the host resolves them through `React.lazy`.
- **CSS Modules** (`*.module.css`) for anything component-specific. The only
  global stylesheet is `shared/src/styles/common.css`; add design tokens there
  rather than hard-coding colours, spacing or shadows in a module.

## Things that will bite you

- **Never load a remote without awaiting `federationReady`.** The federation
  runtime is initialised by an injected entry script that races the React entry
  point. Skipping the gate usually works and occasionally ships two Reacts,
  which surfaces as `Invalid hook call` from a component that looks fine.
- **New exposed component?** Add it to the remote's `exposes` map _and_ to
  `host/public/mfe-manifest.json`. The host has no compile-time knowledge of
  remotes, so TypeScript cannot catch a mismatch — a typo in `scope` or
  `module` surfaces only as a runtime error boundary.
- **New shared dependency?** Add it to `SHARED_DEPENDENCIES` in
  `vite.factory.ts`, not just to `package.json`. Every app has to declare it or
  the ones that do not will load their own copy.
- **The build config is shared.** Edit `vite.factory.ts`; the per-app
  `vite.config.ts` files should stay a handful of lines. The `esnext`,
  `modulePreload` and `cssCodeSplit` settings there are load-bearing for
  federation — the README says why.
- **A failed remote entry is cached by the browser.** Module-map failures are
  permanent for a URL, so anything that retries a remote has to change the URL.
- **Dependencies install at the root.** Use `npm install -D <pkg>` for tooling,
  or `npm install <pkg> --workspace=<app>` for a genuine runtime dependency.
