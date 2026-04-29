import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type ComponentProps, type ParentProps } from "solid-js";
import { cn } from "../../lib/utils";
import { Primitive, type ClassProps } from "./_primitive";

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "relative flex size-9 shrink-0 items-center justify-center rounded-md border bg-card not-dark:bg-clip-padding text-foreground shadow-sm/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4.5",
      },
    },
  },
);

type EmptyProps = ParentProps<Omit<ComponentProps<"div">, "class">> &
  ClassProps;

export function Empty(props: EmptyProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      base={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance px-6 py-12 text-center md:py-20",
        local.className,
        local.class,
      )}
      data-slot="empty"
      {...others}
    />
  );
}

export function EmptyHeader(props: EmptyProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      base={cn(
        "flex max-w-sm flex-col items-center text-center",
        local.className,
        local.class,
      )}
      data-slot="empty-header"
      {...others}
    />
  );
}

export interface EmptyMediaProps
  extends EmptyProps,
    VariantProps<typeof emptyMediaVariants> {}

export function EmptyMedia(props: EmptyMediaProps) {
  const [local, others] = splitProps(props, [
    "children",
    "class",
    "className",
    "variant",
  ]);
  const variant = () => local.variant ?? "default";
  const mediaClass = () =>
    cn(emptyMediaVariants({ variant: variant() }), local.className, local.class);

  return (
    <Primitive
      base={cn("relative mb-6", local.className, local.class)}
      data-slot="empty-media"
      data-variant={variant()}
      {...others}
    >
      {variant() === "icon" ? (
        <>
          <div
            aria-hidden="true"
            class={cn(
              mediaClass(),
              "pointer-events-none absolute bottom-px origin-bottom-left -translate-x-0.5 -rotate-10 scale-84 shadow-none",
            )}
          />
          <div
            aria-hidden="true"
            class={cn(
              mediaClass(),
              "pointer-events-none absolute bottom-px origin-bottom-right translate-x-0.5 rotate-10 scale-84 shadow-none",
            )}
          />
        </>
      ) : null}
      <div class={mediaClass()}>{local.children}</div>
    </Primitive>
  );
}

export function EmptyTitle(props: EmptyProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      base={cn("font-heading font-semibold text-xl", local.className, local.class)}
      data-slot="empty-title"
      {...others}
    />
  );
}

export function EmptyDescription(props: EmptyProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      base={cn(
        "text-muted-foreground text-sm [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 [[data-slot=empty-title]+&]:mt-1",
        local.className,
        local.class,
      )}
      data-slot="empty-description"
      {...others}
    />
  );
}

export function EmptyContent(props: EmptyProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      base={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        local.className,
        local.class,
      )}
      data-slot="empty-content"
      {...others}
    />
  );
}
