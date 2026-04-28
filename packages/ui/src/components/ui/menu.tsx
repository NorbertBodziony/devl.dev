// @ts-nocheck
import { splitProps } from "solid-js";
import { OverlayPanel, OverlayRoot, OverlayTrigger, Primitive } from "./_primitive";
import { cn } from "../../lib/utils";

export const Menu = OverlayRoot;

export function MenuTrigger(props: any) {
  return <OverlayTrigger data-slot="menu-trigger" {...props} />;
}

export function MenuPopup(props: any) {
  const [local, others] = splitProps(props, [
    "align",
    "class",
    "className",
    "side",
    "sideOffset",
  ]);

  return (
    <OverlayPanel
      role="menu"
      align={local.align ?? "center"}
      side={local.side ?? "bottom"}
      sideOffset={local.sideOffset ?? 4}
      base={cn(
        "z-50 flex min-w-32 flex-col rounded-lg border bg-popover not-dark:bg-clip-padding p-1 text-popover-foreground shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        local.className,
        local.class,
      )}
      data-slot="menu-popup"
      {...others}
    />
  );
}

export function MenuItem(props: any) {
  const [local, others] = splitProps(props, ["class", "className", "inset", "variant"]);
  const variant = local.variant ?? "default";

  return (
    <Primitive
      as="button"
      type="button"
      base={cn(
        "flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-left text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:ps-8 data-[variant=destructive]:text-destructive-foreground hover:bg-accent hover:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0",
        local.className,
        local.class,
      )}
      data-inset={local.inset ? "" : undefined}
      data-slot="menu-item"
      data-variant={variant}
      {...others}
    />
  );
}

export function MenuSeparator(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <Primitive
      role="separator"
      base={cn("mx-2 my-1 h-px bg-border", local.className, local.class)}
      data-slot="menu-separator"
      {...others}
    />
  );
}

export function MenuGroup(props: any) {
  return <Primitive data-slot="menu-group" {...props} />;
}

export function MenuGroupLabel(props: any) {
  const [local, others] = splitProps(props, ["class", "className", "inset"]);
  return (
    <Primitive
      base={cn(
        "px-2 py-1.5 font-medium text-muted-foreground text-xs data-inset:ps-9 sm:data-inset:ps-8",
        local.className,
        local.class,
      )}
      data-inset={local.inset ? "" : undefined}
      data-slot="menu-label"
      {...others}
    />
  );
}

export function MenuShortcut(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <Primitive
      as="kbd"
      base={cn(
        "ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest",
        local.className,
        local.class,
      )}
      data-slot="menu-shortcut"
      {...others}
    />
  );
}
