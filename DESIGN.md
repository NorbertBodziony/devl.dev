# Design And Theme Guide

This repo already has a theme system. This file is the shared style guide for building and extracting UI in `devl.dev` without drifting away from the current design language.

## Source Of Truth

- Theme tokens live in `packages/ui/src/styles.css`.
- Theme mode and palette state live in `packages/ui/src/components/theme-provider.tsx`.
- Palette definitions live in `packages/ui/src/themes/palettes.ts`.
- Theme types live in `packages/ui/src/themes/types.ts`.
- Components should consume tokens through Tailwind classes and CSS variables, not hard-coded app-level theme values.

The app is wrapped in `ThemeProvider` from `@orbit/ui/theme-provider`. It writes:

- `.dark` on `document.documentElement` for dark mode.
- `data-palette="<id>"` on `document.documentElement` for palette mode.
- `orbit-theme` and `orbit-theme-palette` in local storage.

Current modes:

- `light`
- `dark`
- `system`

Current palettes:

- `graphite`
- `indigo`
- `crimson`
- `sage`
- `amber`
- `violet`

## Token Rules

Use semantic tokens first:

- Surfaces: `bg-background`, `bg-card`, `bg-popover`
- Text: `text-foreground`, `text-muted-foreground`
- Borders: `border-border`, `border-input`
- Actions: `bg-primary`, `text-primary-foreground`
- States: `text-success-foreground`, `text-warning-foreground`, `text-info-foreground`, `text-destructive-foreground`
- Focus: `ring-ring`, `focus-visible:ring-ring`

Avoid hard-coded colors in reusable components unless the color represents a real domain value or preview swatch. If a component needs a status color, prefer a narrow `tone` prop and map it to semantic classes.

## Component Rules

All reusable UI belongs in `packages/ui`.

- Generic primitives: `packages/ui/src/components/ui/*`
- Showcase components: `packages/ui/src/components/showcase/*`
- Demo components: `packages/ui/src/components/demo/*`
- Shared www wrappers/pages: `packages/ui/src/components/www*`
- Shared www data/helpers: `packages/ui/src/lib/www/*`

Use package subpaths from app code:

```tsx
import { Button } from "@orbit/ui/button";
import { CopyButton } from "@orbit/ui/copy-button";
import { SettingsWebhooksShowcasePage } from "@orbit/ui/showcase/settings-webhooks";
```

`apps/www/src/pages/**` and `apps/www/src/components/**` should stay as wrappers/re-exports or thin route glue. Do not add new app-local capitalized UI helpers there.

## Naming

Reusable primitives should have generic names only when the contract is generic:

- `CopyButton`
- `CodeBlock`
- `StatusIndicator`
- `MetricTile`
- `InfoSection`
- `KeyValueRow`

Showcase/demo components should use source-prefixed names when exported to avoid collisions:

- `DashboardServicesServiceCard`
- `TimelinesPrOpsNotice`
- `AuthLeftSigninBrandMark`

Do not export broad names like `Card`, `Section`, or `Row` from showcase-specific modules unless the module namespace makes the purpose clear.

## Visual Style

The default Orbit style is restrained, dense, and work-focused:

- Prefer quiet surfaces, tight spacing, and clear hierarchy.
- Use real controls, not decorative copies of controls.
- Keep cards at `rounded-lg` or smaller unless an existing primitive uses a larger radius.
- Use `font-mono` for metadata, IDs, timestamps, keyboard hints, and compact labels.
- Use `font-heading` for page titles and prominent section headings.
- Prefer semantic contrast over opacity stacking.
- Avoid one-note palettes. Do not make a whole page read as a single hue.

## Interaction Style

- Use existing primitives first: `button`, `tooltip`, `menu`, `popover`, `select`, `sheet`, `tabs`, `table`, `card`, `field`, `badge`.
- Buttons should include icons when the action has a familiar symbol.
- Icon-only controls need an accessible label.
- Copy actions should use `CopyButton` and visibly enter a copied state.
- Dropdowns/popovers/tooltips should be smoke-tested after changes.

## Solid Conventions

New shared components should use Solid-native types:

- `JSX.Element`
- `ComponentProps`
- `ParentProps`
- explicit function props where needed

Do not add new `React.*` types in new shared components. Existing compatibility shims can stay until intentionally migrated.

Be careful at extracted boundaries:

- Signals are functions: `value()`.
- Plain props are values: `props.value`.
- If passing a signal intentionally, name the prop clearly, such as `valueAccessor`.

## Verification

For structural UI refactors, run:

```bash
npm run typecheck
npm run build
```

For extraction passes, also check the app inventory:

```bash
rg "^(export )?(function|const) [A-Z][A-Za-z0-9_]*\\b|=>\\s*<" apps/www/src/pages apps/www/src/components -g "*.tsx"
```

Expected result: no non-entry local UI component declarations in those app folders.

Smoke-check representative routes and interactions:

- `/`
- `/demo`
- `/c/settings/webhooks`
- `/c/filters/faceted`
- `/c/filters/toolbar`
- `/c/layouts/canvas-tools`
- All registered `/c/<category>/<design>` showcase routes for broad extraction work.

