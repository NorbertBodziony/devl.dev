import { splitProps, type JSX } from "solid-js";
import { CheckIcon, MinusIcon, PlayIcon, XIcon } from "lucide-solid";
import { cn } from "../../lib/utils";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "running";

type NativeSpanProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface StatusIndicatorProps extends NativeSpanProps {
  tone: StatusTone;
  className?: string;
  label?: JSX.Element;
  appearance?: "dot" | "icon";
  dotClass?: string;
  labelClass?: string;
}

const DOT_TONE: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-destructive",
  info: "bg-sky-500",
  muted: "bg-muted-foreground/60",
  running: "animate-pulse bg-amber-500",
};

const LABEL_TONE: Record<StatusTone, string> = {
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-destructive",
  info: "text-sky-600 dark:text-sky-400",
  muted: "text-muted-foreground",
  running: "text-amber-600 dark:text-amber-400",
};

function StatusIcon(props: { tone: StatusTone }) {
  if (props.tone === "danger") {
    return (
      <span class="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
        <XIcon class="size-3 stroke-[3]" />
      </span>
    );
  }

  if (props.tone === "success") {
    return (
      <span class="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <CheckIcon class="size-3 stroke-[3]" />
      </span>
    );
  }

  if (props.tone === "running") {
    return (
      <span class="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
        <PlayIcon class="size-2.5 fill-current stroke-[3]" />
      </span>
    );
  }

  return (
    <span class="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/50 text-muted-foreground">
      <MinusIcon class="size-3 stroke-[2.5]" />
    </span>
  );
}

export function StatusIndicator(props: StatusIndicatorProps) {
  const [local, others] = splitProps(props, [
    "appearance",
    "class",
    "className",
    "dotClass",
    "label",
    "labelClass",
    "tone",
  ]);

  return (
    <span
      {...others}
      class={cn("inline-flex items-center gap-1.5", local.className, local.class)}
    >
      {local.appearance === "icon" ? (
        <StatusIcon tone={local.tone} />
      ) : (
        <span class={cn("size-1.5 rounded-full", DOT_TONE[local.tone], local.dotClass)} />
      )}
      {local.label !== undefined ? (
        <span
          class={cn(
            "text-[10px] uppercase tracking-wider",
            LABEL_TONE[local.tone],
            local.labelClass,
          )}
        >
          {local.label}
        </span>
      ) : null}
    </span>
  );
}
