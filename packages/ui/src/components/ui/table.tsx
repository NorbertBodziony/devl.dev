// @ts-nocheck
import { splitProps } from "solid-js";
import { cn } from "../../lib/utils";

export type TableVariant = "default" | "card";

export function Table(props: any) {
  const [local, others] = splitProps(props, ["class", "className", "variant"]);
  const variant = local.variant ?? "default";

  return (
    <div
      class="relative w-full overflow-x-auto"
      data-slot="table-container"
      data-variant={variant}
    >
      <table
        class={cn(
          "w-full caption-bottom in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0 text-sm",
          local.className,
          local.class,
        )}
        data-slot="table"
        {...others}
      />
    </div>
  );
}

export function TableHeader(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <thead
      class={cn("[&_tr]:border-b", local.className, local.class)}
      data-slot="table-header"
      {...others}
    />
  );
}

export function TableBody(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <tbody
      class={cn(
        "relative in-data-[variant=card]:rounded-xl in-data-[variant=card]:shadow-xs/5 before:pointer-events-none before:absolute before:inset-px not-in-data-[variant=card]:before:hidden before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/8%)] [&_tr:last-child]:border-0 in-data-[variant=card]:*:[tr]:border-0 in-data-[variant=card]:*:[tr]:*:[td]:border-b in-data-[variant=card]:*:[tr]:*:[td]:bg-card in-data-[variant=card]:*:[tr]:first:*:[td]:first:rounded-ss-xl in-data-[variant=card]:*:[tr]:*:[td]:first:border-s in-data-[variant=card]:*:[tr]:first:*:[td]:border-t in-data-[variant=card]:*:[tr]:last:*:[td]:last:rounded-ee-xl in-data-[variant=card]:*:[tr]:*:[td]:last:border-e in-data-[variant=card]:*:[tr]:first:*:[td]:last:rounded-se-xl in-data-[variant=card]:*:[tr]:last:*:[td]:first:rounded-es-xl in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_4%)] dark:in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_4%)] dark:in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]",
        local.className,
        local.class,
      )}
      data-slot="table-body"
      {...others}
    />
  );
}

export function TableFooter(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <tfoot
      class={cn(
        "border-t in-data-[variant=card]:border-none bg-transparent not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] font-medium dark:not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)] [&>tr]:last:border-b-0",
        local.className,
        local.class,
      )}
      data-slot="table-footer"
      {...others}
    />
  );
}

export function TableRow(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <tr
      class={cn(
        "relative border-b not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-black)_2%)] not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-black)_4%)] dark:not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-white)_4%)] dark:not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-white)_2%)]",
        local.className,
        local.class,
      )}
      data-slot="table-row"
      {...others}
    />
  );
}

export function TableHead(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <th
      class={cn(
        "h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium text-muted-foreground leading-none has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
        local.className,
        local.class,
      )}
      data-slot="table-head"
      {...others}
    />
  );
}

export function TableCell(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <td
      class={cn(
        "whitespace-nowrap bg-clip-padding p-2.5 in-data-[slot=table-footer]:py-3.5 align-middle leading-none in-data-[variant=card]:first:ps-[calc(--spacing(2.5)-1px)] in-data-[variant=card]:last:pe-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
        local.className,
        local.class,
      )}
      data-slot="table-cell"
      {...others}
    />
  );
}

export function TableCaption(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <caption
      class={cn(
        "in-data-[variant=card]:my-4 mt-4 text-muted-foreground text-sm",
        local.className,
        local.class,
      )}
      data-slot="table-caption"
      {...others}
    />
  );
}
