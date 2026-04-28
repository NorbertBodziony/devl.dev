// @ts-nocheck
import { splitProps, type JSX } from "solid-js";
import { XIcon } from "lucide-solid";
import { cn } from "../../lib/utils";
import { Button } from "./button";

type ToastTone = "default" | "success" | "error" | "warning" | "info" | "inverse";
type ToastPosition = "top-right" | "bottom-right" | "bottom-center" | "top";

const rootVariants = {
  default: "rounded-lg border border-border/70 bg-background text-foreground shadow-lg",
  success: "rounded-lg border border-border/70 bg-background text-foreground shadow-lg backdrop-blur",
  error: "rounded-lg border border-destructive/40 bg-background text-foreground shadow-lg",
  progress: "rounded-xl border border-border/70 bg-background text-foreground shadow-lg",
  rich: "rounded-xl border border-border/70 bg-background text-foreground shadow-lg",
  inverse: "overflow-hidden rounded-lg border border-foreground/10 bg-foreground text-background shadow-xl",
};

const viewportPositions: Record<ToastPosition, string> = {
  "top-right": "absolute top-6 right-6 z-50",
  "bottom-right": "absolute right-6 bottom-6 z-50",
  "bottom-center": "-translate-x-1/2 absolute bottom-8 left-1/2 z-50",
  top: "sticky top-0 z-50",
};

const toneIconClasses: Record<ToastTone, string> = {
  default: "bg-foreground/[0.06] text-foreground",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  error: "bg-destructive/15 text-destructive",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  info: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  inverse: "bg-background/15 text-background",
};

export function ToastProvider(props: { children?: JSX.Element }) {
  return <>{props.children}</>;
}

export function ToastViewport(props: {
  position?: ToastPosition;
  stacked?: boolean;
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["position", "stacked", "class", "className", "children"]);
  return (
    <div
      {...others}
      class={cn(
        viewportPositions[local.position ?? "top-right"],
        local.stacked && "flex flex-col gap-2",
        local.className,
        local.class,
      )}
    >
      {local.children}
    </div>
  );
}

export function ToastRoot(props: {
  variant?: keyof typeof rootVariants;
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["variant", "class", "className", "children"]);
  return (
    <article
      {...others}
      class={cn(rootVariants[local.variant ?? "default"], local.className, local.class)}
    >
      {local.children}
    </article>
  );
}

export function ToastRow(props: {
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["class", "className", "children"]);
  return (
    <div {...others} class={cn("flex items-start gap-3", local.className, local.class)}>
      {local.children}
    </div>
  );
}

export function ToastIcon(props: {
  tone?: ToastTone;
  size?: "sm" | "md";
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["tone", "size", "class", "className", "children"]);
  return (
    <span
      {...others}
      class={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        local.size === "sm" ? "size-5 [&_svg]:size-3" : "size-7 [&_svg]:size-4",
        toneIconClasses[local.tone ?? "default"],
        local.className,
        local.class,
      )}
    >
      {local.children}
    </span>
  );
}

export function ToastAvatar(props: {
  initials: string;
  class?: string;
  className?: string;
}) {
  const [local, others] = splitProps(props, ["initials", "class", "className"]);
  return (
    <div
      {...others}
      class={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full font-medium text-[11px]",
        local.className,
        local.class,
      )}
    >
      {local.initials}
    </div>
  );
}

export function ToastContent(props: {
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["class", "className", "children"]);
  return (
    <div {...others} class={cn("min-w-0 flex-1", local.className, local.class)}>
      {local.children}
    </div>
  );
}

export function ToastTitle(props: {
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["class", "className", "children"]);
  return (
    <div {...others} class={cn("font-medium text-sm", local.className, local.class)}>
      {local.children}
    </div>
  );
}

export function ToastDescription(props: {
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["class", "className", "children"]);
  return (
    <p
      {...others}
      class={cn("mt-1 text-muted-foreground text-xs leading-relaxed", local.className, local.class)}
    >
      {local.children}
    </p>
  );
}

export function ToastMeta(props: {
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["class", "className", "children"]);
  return (
    <span
      {...others}
      class={cn(
        "font-mono text-[10px] text-muted-foreground/70 uppercase tracking-[0.2em]",
        local.className,
        local.class,
      )}
    >
      {local.children}
    </span>
  );
}

export function ToastBadge(props: {
  tone?: "error" | "default";
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["tone", "class", "className", "children"]);
  return (
    <span
      {...others}
      class={cn(
        "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em]",
        local.tone === "error"
          ? "bg-destructive/10 text-destructive"
          : "bg-foreground/[0.06] text-muted-foreground",
        local.className,
        local.class,
      )}
    >
      {local.children}
    </span>
  );
}

export function ToastActions(props: {
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["class", "className", "children"]);
  return (
    <div {...others} class={cn("flex items-center gap-1", local.className, local.class)}>
      {local.children}
    </div>
  );
}

export function ToastAction(props: any) {
  return <Button size={props.size ?? "xs"} variant={props.variant ?? "ghost"} type="button" {...props} />;
}

export function ToastClose(props: any) {
  const [local, others] = splitProps(props, ["class", "className", "children", "inverse"]);
  return (
    <button
      type="button"
      aria-label="Dismiss"
      {...others}
      class={cn(
        "rounded-md p-1 transition-colors",
        local.inverse
          ? "opacity-60 transition-opacity hover:opacity-100"
          : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
        local.className,
        local.class,
      )}
    >
      {local.children ?? <XIcon className="size-3.5" />}
    </button>
  );
}

export function ToastProgress(props: {
  value: number;
  inverse?: boolean;
  class?: string;
  className?: string;
}) {
  const [local, others] = splitProps(props, ["value", "inverse", "class", "className"]);
  return (
    <div
      {...others}
      class={cn(
        "h-1 overflow-hidden rounded-full",
        local.inverse ? "bg-background/10" : "bg-foreground/[0.06]",
        local.className,
        local.class,
      )}
    >
      <div
        class={cn(
          "h-full rounded-full transition-[width]",
          local.inverse ? "bg-background/40 duration-100" : "bg-foreground/70",
        )}
        style={{ width: `${Math.max(0, Math.min(100, local.value))}%` }}
      />
    </div>
  );
}

export function ToastBanner(props: {
  tone?: "warning" | "info";
  class?: string;
  className?: string;
  children?: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["tone", "class", "className", "children"]);
  const tone = () => local.tone ?? "warning";
  return (
    <div
      {...others}
      class={cn(
        "border-b backdrop-blur",
        tone() === "warning"
          ? "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:bg-amber-500/[0.08] dark:text-amber-100"
          : "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:bg-sky-500/[0.08] dark:text-sky-100",
        local.className,
        local.class,
      )}
    >
      {local.children}
    </div>
  );
}

export const toastManager = { add: () => {}, remove: () => {}, update: () => {} };
export const anchoredToastManager = toastManager;
export const AnchoredToastProvider = ToastProvider;
