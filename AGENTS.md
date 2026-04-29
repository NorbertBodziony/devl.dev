# AGENTS.md

## Project context

This repo is a fork of Sean Brydon's [`devl.dev`](https://github.com/sean-brydon/devl.dev).
The public site is [devl.dev](https://www.devl.dev/).

Current direction: rewrite the original React app into SolidJS while preserving
the original visual and interaction intent, then extract reusable UI into
`@orbit/ui`.

## Layout

- `apps/www` — Solid Start app using TanStack Solid Router (port 4000).
- `packages/ui` — reusable Solid UI components exported as `@orbit/ui/*`.

## Rewrite workflow

- Original React source lives in Sean Brydon's upstream repo:
  <https://github.com/sean-brydon/devl.dev>.
- Treat the upstream React repo and the live public site at
  <https://www.devl.dev/> as the source references when porting or fixing a
  component.
- Compare layout, spacing, typography, colors, responsive behavior, hovers,
  popups, animation, dark/light behavior, and browser console state.
- Use the in-app browser / Browser Use flow for visual verification of local
  pages.

## Component boundary

- Reusable, opinionated UI belongs in `packages/ui` and should be exported
  through `@orbit/ui/*`.
- `apps/www` showcase pages should stay thin: local demo data/config only,
  importing reusable UI from `@orbit/ui`.
- Shared UI components should reuse other `@orbit/ui` primitives/components
  where possible.
- Avoid mocks, compatibility shims, and app-local copies when the behavior
  should be reusable.
- Use `packages/ui/DESIGN.md` for detailed design-system rules, tokens, and
  package boundary guidance.

## Porting rules

- When rewriting a React component, first inspect the original React source and
  the public page.
- Split implementation into reusable UI component(s), private UI internals, and
  app-local example data.
- Preserve original design behavior unless intentionally improving it.
- If registry output is affected, run `bun run registry`.

## Commands

```bash
bun run dev          # Start the app on :4000
bun run typecheck    # Type-check all workspaces
bun run build        # Build all workspaces
bun run lint         # Lint all workspaces
```

## Verification

```bash
bun run typecheck    # Run for code changes
bun run build        # Run for broader package/app changes
bun run registry     # Run when showcase or @orbit/ui exports affect registry output
```

Browser-check the relevant `/c/<category>/<slug>` route after UI changes.
