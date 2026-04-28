// @ts-nocheck
import { Primitive } from "./_primitive";
export const Kbd = (p: any) => (
  <Primitive
    as="kbd"
    base="pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded bg-muted px-1 font-medium font-sans text-muted-foreground text-xs [&_svg:not([class*='size-'])]:size-3"
    data-slot="kbd"
    {...p}
  />
);
export const KbdGroup = (p: any) => (
  <Primitive
    as="kbd"
    base="inline-flex items-center gap-1"
    data-slot="kbd-group"
    {...p}
  />
);
