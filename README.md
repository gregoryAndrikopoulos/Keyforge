# Keyforge 🔑

Keyforge is a web application for generating random, secure passwords.
It is built with **React** and powered by **Vite** for fast development
and optimized builds.

---

## Workflow Status

[![E2E
Tests](https://github.com/gregoryAndrikopoulos/keyforge/actions/workflows/e2e_test.yml/badge.svg)](https://github.com/gregoryAndrikopoulos/keyforge/actions/workflows/e2e_test.yml)

---

## Technologies Used

- **React 19** — UI library for building the frontend
- **Vite** — fast dev server and bundler
- **WebdriverIO v9** — automation testing framework
- **Mocha** — test framework for writing and executing tests
- **Node.js** — JavaScript runtime environment
- **GitHub Actions** — continuous integration and automated test runs

### Developer Tooling

- **ESLint** — linting
- **Prettier** — formatting
- **asdf** — runtime version manager (pins Node & pnpm versions per project)

---

## Runtime Versions (Node & pnpm)

This repository pins tool versions via **asdf** in `.tool-versions`:

```txt
nodejs 24.7.0
pnpm 10.15.0
```

---

## Prerequisites

- **Node.js** `>=24 <25`
- **pnpm** `>=10 <11`

Ensure you have the correct versions installed. If you use
[asdf](https://asdf-vm.com/), you can pin them with:

```bash
asdf install
```

---

## Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

---

## Development

Run the local development server:

```bash
pnpm dev
```

Open <http://localhost:5173> in browser.
