import { createSignal, onCleanup, splitProps, type JSX } from "solid-js";
import { CheckIcon, CopyIcon } from "lucide-solid";
import { cn } from "../../lib/utils";

type NativeButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export interface CopyButtonProps
  extends Omit<NativeButtonProps, "children" | "type" | "value"> {
  value: string;
  className?: string;
  "aria-label"?: string;
  variant?: "text" | "icon" | "outline";
  label?: string;
  copiedLabel?: string;
  timeoutMs?: number;
  iconClass?: string;
}

export function CopyButton(props: CopyButtonProps) {
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "aria-label",
    "copiedLabel",
    "iconClass",
    "label",
    "onClick",
    "timeoutMs",
    "value",
    "variant",
  ]);
  const [copied, setCopied] = createSignal(false);
  let timeoutId: number | undefined;
  onCleanup(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  });

  const copy = (event: MouseEvent) => {
    (local.onClick as ((event: MouseEvent) => void) | undefined)?.(event);
    if (event.defaultPrevented) return;

    if (others.disabled || !local.value) return;

    try {
      void navigator.clipboard?.writeText?.(local.value)?.catch?.(() => {});
    } catch {
      // Clipboard can be unavailable in non-browser previews.
    }

    setCopied(true);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => setCopied(false), local.timeoutMs ?? 1200);
  };

  const isIcon = () => local.variant === "icon";
  const isOutline = () => local.variant === "outline";
  const copyLabel = () => local.label ?? "Copy";
  const copiedLabel = () => local.copiedLabel ?? "Copied";

  return (
    <button
      type="button"
      {...others}
      onClick={copy}
      aria-label={isIcon() ? copyLabel() : local["aria-label"]}
      class={cn(
        isIcon()
          ? "inline-flex items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
          : isOutline()
            ? "relative inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-input bg-popover px-[calc(--spacing(2.5)-1px)] font-medium text-foreground text-sm shadow-xs/5 outline-none transition-shadow hover:bg-accent/50 disabled:pointer-events-none disabled:opacity-64 sm:h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4"
            : "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] transition-colors hover:bg-foreground/[0.05] hover:text-foreground",
        local.className,
        local.class,
      )}
    >
      {copied() ? (
        <CheckIcon class={cn("size-3 text-emerald-500", local.iconClass)} />
      ) : (
        <CopyIcon class={cn("size-3", local.iconClass)} />
      )}
      {isIcon() ? null : copied() ? copiedLabel() : copyLabel()}
    </button>
  );
}
