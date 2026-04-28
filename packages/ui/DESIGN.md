# Orbit UI Design System

`@orbit/ui` is the reusable design-system package for this repo. It owns shared primitives, theme runtime, design tokens, palettes, hooks, and generic components. Product pages, showcases, demo state, preview helpers, generated registry data, and route-specific UI live in `apps/www`.

## Package Boundary

- Put reusable primitives in `packages/ui/src/components/ui`.
- Put reusable theme/runtime components in `packages/ui/src/components`.
- Put shared hooks in `packages/ui/src/hooks` and shared utilities in `packages/ui/src/lib`.
- Do not export app-only helpers, showcase/demo pages, preview image helpers, wireframe icons, or compatibility shims from `@orbit/ui`.
- App-owned showcase and demo source lives in `apps/www/src/pages`; app-only helpers live in `apps/www/src/components` or `apps/www/src/lib`.

Use package imports for reusable UI:

```tsx
import { Button } from "@orbit/ui/button";
import { Dialog, DialogPopup, DialogTrigger } from "@orbit/ui/dialog";
import { ThemeProvider } from "@orbit/ui/theme-provider";
```

Use app imports for app-owned helpers:

```tsx
import { ChartContainer } from "@/components/chart";
import { createSignal } from "solid-js";
```

## Theme And Color

- Global CSS tokens live in `packages/ui/src/styles.css`.
- Theme mode and palette state live in `@orbit/ui/theme-provider`.
- Palette definitions live in `packages/ui/src/themes/palettes.ts`.
- Theme types live in `packages/ui/src/themes/types.ts`.
- `ORBIT_THEME_HEAD_SCRIPT` must run in the document head before hydration so `.dark`, `data-palette`, and `color-scheme` are available before CSS paints.
- Default theme preference is dark; supported modes are `light`, `dark`, and `system`.
- Supported palettes are `graphite`, `indigo`, `crimson`, `sage`, `amber`, and `violet`.

Prefer semantic tokens over hard-coded colors:

- Surfaces: `bg-background`, `bg-card`, `bg-popover`
- Text: `text-foreground`, `text-muted-foreground`
- Borders: `border-border`, `border-input`
- Actions: `bg-primary`, `text-primary-foreground`
- Focus: `ring-ring`, `focus-visible:ring-ring`
- States: `success`, `warning`, `info`, `destructive`

Hard-coded colors are acceptable only for real domain values, visual previews, charts, or swatches.

## Typography

Use at most two font families:

- `font-sans` and `font-heading`: Inter
- `font-mono`: system monospace stack

Use `font-heading` for page titles and prominent section headings. Use `font-mono` for metadata, IDs, timestamps, keyboard hints, compact labels, code, and tabular values. Do not add another web font without replacing one of these families.

## Base Style

- The Orbit style is quiet, dense, and work-focused.
- Prefer semantic contrast over opacity stacking.
- Keep reusable component radius at `rounded-lg` or smaller unless the primitive already defines a larger radius.
- Use `border-border`, `shadow-xs/5`, and subtle `bg-muted`/`bg-accent` states before adding custom effects.
- Focus states must be visible and token-driven: `focus-visible:ring-ring`, `focus-visible:ring-offset-background`.
- Icons should come from `lucide-solid` when a familiar icon exists.
- Icon-only controls need an accessible label.

## Component Conventions

- `Button`: use existing variants/sizes; include icons for familiar actions; preserve loading/disabled states.
- `Input`, `Textarea`, `Field`, `Label`: keep labels explicit and support native form semantics.
- `Card`: use for individual framed items, not page sections or nested card shells.
- `Badge`, `Kbd`, `StatusIndicator`: keep compact text stable and use semantic tones.
- `Table`: preserve dense scanning, row hover/selected states, and tabular numeric alignment.
- `Dialog`, `Sheet`, `Popover`, `Menu`, `Tooltip`: use the package primitives and smoke-test open/close/focus behavior after changes.
- New shared components should use Solid-native types such as `JSX.Element`, `ComponentProps`, and `ParentProps`; do not introduce new `React.*` types.

## Verification

For design-system boundary or token changes, run:

```bash
rg '<removed ui www subpaths>' apps/www packages/ui scripts
rg '<removed secondary font packages>' packages/ui package.json bun.lock
bun run registry
bun run typecheck
bun run build
```

Smoke-check representative routes:

- `/c/charts/waterfall`
- `/c/layouts/workspace-rail`
- `/c/filters/chips`
- `/c/settings/appearance`
- `/demo`
