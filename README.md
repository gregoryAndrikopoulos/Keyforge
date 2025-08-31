# Keyforge 🔑

Keyforge is a web application for generating random, secure passwords.
It is built with **React** and powered by **Vite** for fast development
and optimized builds.

---

## Workflow Status

[![E2E Tests](https://github.com/gregoryAndrikopoulos/keyforge/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/keyforge/actions/workflows/e2e_test.yml)

---

## Tech Stack

- **React 19** — UI
- **Vite 7** — dev server & bundler
- **Vitest 3 + Testing Library** — unit/component tests
- **WebdriverIO 9 (DevTools)** + **Mocha** — E2E tests
- **ESLint** + **Prettier** — linting & formatting
- **GitHub Actions** — CI for E2E
- **Node 24**, **pnpm 10** — runtime & package manager

### Runtime Versions

This repo pins tool versions via **asdf** in `.tool-versions`:

```txt
nodejs 24.7.0
pnpm 10.15.0
```

> If you use `asdf`, simply run:
>
> ```bash
> asdf install
> ```

---

## Requirements

- **Node.js** `>=24 <25`
- **pnpm** `>=10 <11`

---

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the dev server (default: <http://localhost:5173>):

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build locally (default: <http://localhost:4173>):

```bash
pnpm preview
```

---

## Testing

### Unit / Component tests (Vitest + Testing Library)

- Location: `src/**/*.test.{js,jsx,ts,tsx}` (co-located with components)
- JSDOM environment with a small setup file at `src/test-utils/setupUnitTests.js`
  (adds `@testing-library/jest-dom` matchers and a Web Crypto shim).

Run once in CI mode:

```bash
pnpm test:unit
```

### End-to-End tests (WebdriverIO + Mocha)

- Specs live under: `test/specs/`
- Page Objects under: `test/page-objects/`
- Config at: `test/wdio.conf.js`

The WDIO config auto-picks a **baseUrl**:
- `http://localhost:4173` if a `pnpm preview` server is already up, else
- `http://localhost:5173` for the dev server.

You can also override via env:

```bash
WDIO_BASEURL=http://localhost:4173 pnpm test:e2e
```

Typical local flows:

```bash
# 1) Run against the dev server (in another terminal)
pnpm dev
pnpm test:e2e

# 2) Run against a preview server
pnpm build
pnpm preview &
pnpm test:e2e
```
