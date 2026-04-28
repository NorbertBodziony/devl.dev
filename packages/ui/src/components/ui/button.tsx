// @ts-nocheck
import { splitProps } from "solid-js";
import { cn } from "../../lib/utils";
import { Spinner } from "./spinner";

const base =
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 data-loading:select-none data-loading:text-transparent sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0";

const variants = {
  default:
    "border-primary bg-primary text-primary-foreground shadow-primary/24 shadow-xs hover:bg-primary/90 active:bg-primary/90 disabled:shadow-none",
  destructive:
    "border-destructive bg-destructive text-white shadow-destructive/24 shadow-xs hover:bg-destructive/90 active:bg-destructive/90 disabled:shadow-none",
  "destructive-outline":
    "border-input bg-popover text-destructive-foreground shadow-xs/5 hover:border-destructive/32 hover:bg-destructive/4 active:border-destructive/32 active:bg-destructive/4 dark:bg-input/32 dark:hover:bg-input/64",
  ghost:
    "border-transparent text-foreground hover:bg-accent active:bg-accent",
  link: "border-transparent text-foreground underline-offset-4 hover:underline active:underline",
  outline:
    "border-input bg-popover text-foreground shadow-xs/5 hover:bg-accent/50 active:bg-accent/50 dark:bg-input/32 dark:hover:bg-input/64",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
};

const sizes = {
  default: "h-9 px-[calc(--spacing(3)-1px)] sm:h-8",
  icon: "size-9 sm:size-8",
  "icon-lg": "size-10 sm:size-9",
  "icon-sm": "size-8 sm:size-7",
  "icon-xl":
    "size-11 sm:size-10 [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
  "icon-xs":
    "size-7 rounded-md sm:size-6 not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-4 sm:not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
  lg: "h-10 px-[calc(--spacing(3.5)-1px)] sm:h-9",
  sm: "h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:h-7",
  xl: "h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
  xs: "h-7 gap-1 rounded-md px-[calc(--spacing(2)-1px)] text-sm sm:h-6 sm:text-xs [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
};

export function Button(props: any) {
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "children",
    "disabled",
    "loading",
    "size",
    "variant",
  ]);
  const variant = () => local.variant ?? "default";
  const size = () => local.size ?? "default";
  const isDisabled = () => Boolean(local.loading || local.disabled);

  return (
    <button
      type="button"
      {...others}
      aria-disabled={local.loading ? true : undefined}
      class={cn(
        base,
        variants[variant()] ?? variants.default,
        sizes[size()] ?? sizes.default,
        local.className,
        local.class,
      )}
      data-loading={local.loading ? "" : undefined}
      data-slot="button"
      disabled={isDisabled()}
    >
      {local.children}
      {local.loading ? (
        <Spinner
          class="pointer-events-none absolute"
          data-slot="button-loading-indicator"
        />
      ) : null}
    </button>
  );
}
