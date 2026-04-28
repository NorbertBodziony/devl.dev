import { splitProps, type JSX } from "solid-js";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-solid";
import { cn } from "../../lib/utils";

type NativeDivProps = JSX.HTMLAttributes<HTMLDivElement>;

export type MetricTone = "neutral" | "positive" | "warning" | "danger";
export type MetricTrend = "up" | "down";

export interface MetricTileProps extends NativeDivProps {
  label: JSX.Element;
  value: JSX.Element;
  className?: string;
  delta?: JSX.Element;
  dotClass?: string;
  labelClass?: string;
  sub?: JSX.Element;
  tone?: MetricTone;
  trailing?: JSX.Element;
  trend?: MetricTrend;
  valueClass?: string;
  variant?: "summary" | "stat" | "compact";
}

const VALUE_TONE: Record<MetricTone, string> = {
  neutral: "text-foreground",
  positive: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
};

const DELTA_TONE: Record<MetricTone, string> = {
  neutral: "bg-foreground/[0.06] text-foreground",
  positive: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  danger: "bg-rose-500/12 text-rose-600 dark:text-rose-400",
};

export function MetricTile(props: MetricTileProps) {
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "delta",
    "dotClass",
    "label",
    "labelClass",
    "sub",
    "tone",
    "trailing",
    "trend",
    "value",
    "valueClass",
    "variant",
  ]);

  const tone = () => local.tone ?? "neutral";
  const variant = () => local.variant ?? "summary";
  const valueSize = () =>
    variant() === "compact"
      ? "font-mono text-sm"
      : variant() === "stat"
        ? "font-heading text-3xl tracking-tight"
        : "font-mono text-2xl";

  return (
    <div
      {...others}
      class={cn(
        "rounded-xl border border-border/60 bg-background/40 p-4",
        variant() === "compact" ? "rounded-md border-0 bg-foreground/[0.03] px-2 py-1.5" : null,
        local.className,
        local.class,
      )}
    >
      <div class="flex items-center justify-between gap-3">
        <div
          class={cn(
            "flex min-w-0 items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]",
            local.labelClass,
          )}
        >
          {local.dotClass ? <span class={cn("size-1.5 rounded-full", local.dotClass)} /> : null}
          <span class="truncate">{local.label}</span>
        </div>
        {local.trailing}
      </div>
      <div class={cn("mt-1 tabular-nums", valueSize(), VALUE_TONE[tone()], local.valueClass)}>
        {local.value}
      </div>
      {local.delta || local.sub ? (
        <div class="mt-1 flex items-center gap-1.5 text-xs">
          {local.delta ? (
            <span
              class={cn(
                "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10px]",
                DELTA_TONE[tone()],
              )}
            >
              {local.trend === "down" ? (
                <ArrowDownRightIcon class="size-3" />
              ) : local.trend === "up" ? (
                <ArrowUpRightIcon class="size-3" />
              ) : null}
              {local.delta}
            </span>
          ) : null}
          {local.sub ? <span class="text-muted-foreground">{local.sub}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

export function SummaryTile(props: MetricTileProps) {
  return <MetricTile {...props} variant={props.variant ?? "summary"} />;
}
