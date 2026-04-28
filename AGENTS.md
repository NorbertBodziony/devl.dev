# AGENTS.md

## Project context

This repo is a fork of Sean Brydon's [`devl.dev`](https://github.com/sean-brydon/devl.dev).
The public site is [devl.dev](https://www.devl.dev/).

Current direction: rewrite the app into SolidJS and extract reusable UI into components.

## Layout

- `apps/www` — Solid Start app using TanStack Solid Router (port 4000).
- `packages/ui` — reusable Solid UI components exported as `@orbit/ui/*`.

## Commands

```bash
bun run dev          # Start the app on :4000
bun run typecheck    # Type-check all workspaces
bun run build        # Build all workspaces
bun run lint         # Lint all workspaces
```
