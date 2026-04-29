import { ArrowDownRightIcon } from "lucide-solid";
import { cn } from "../../lib/utils";

export interface FunnelStage {
  count: number;
  kind: string;
  name: string;
}

export interface FunnelStat {
  label: string;
  tone: "amber" | "emerald" | "rose";
  value: string;
}

export interface FunnelChartProps {
  class?: string;
  stages: readonly FunnelStage[];
  stats?: readonly FunnelStat[];
}

export function FunnelChart(props: FunnelChartProps) {
  const max = () => props.stages[0]?.count ?? 1;

  return (
    <div class={cn("flex flex-col", props.class)}>
      <div class="flex flex-col">
        {props.stages.map((stage, index) => {
          const previous = props.stages[index - 1];
          const widthPct = (stage.count / max()) * 100;
          const drop = previous
            ? ((previous.count - stage.count) / previous.count) * 100
            : 0;
          const carry = previous ? (stage.count / previous.count) * 100 : 100;

          return (
            <div class="relative">
              <div class="grid grid-cols-[200px_1fr_120px] items-center gap-4 py-3">
                <div>
                  <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    {stage.kind}
                  </div>
                  <div class="text-sm">{stage.name}</div>
                </div>
                <div class="relative h-12">
                  <div class="absolute inset-0 rounded-md bg-background" />
                  <div
                    class="absolute inset-y-0 left-0 rounded-md transition-all"
                    style={{
                      width: `${widthPct}%`,
                      background:
                        "linear-gradient(90deg, color-mix(in srgb, var(--chart-1) 95%, transparent), color-mix(in srgb, var(--chart-1) 55%, transparent))",
                    }}
                  />
                  <div class="absolute inset-y-0 right-3 flex items-center">
                    <span class="font-mono text-[11px] text-muted-foreground">
                      {widthPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-heading text-lg tabular-nums">
                    {stage.count.toLocaleString()}
                  </div>
                  <div class="font-mono text-[10px] text-muted-foreground">
                    {previous ? `${carry.toFixed(1)}% carry` : "baseline"}
                  </div>
                </div>
              </div>
              {previous ? (
                <div class="absolute -top-3 left-[208px] inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 font-mono text-[10px] text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-400">
                  <ArrowDownRightIcon class="size-3" />-{drop.toFixed(1)}%{" "}
                  <span class="text-muted-foreground">
                    ({(previous.count - stage.count).toLocaleString()})
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {props.stats ? (
        <div class="mt-6 grid grid-cols-3 gap-3">
          {props.stats.map((stat) => (
            <Stat stat={stat} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Stat(props: { stat: FunnelStat }) {
  const tones: Record<FunnelStat["tone"], string> = {
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  };

  return (
    <div class="rounded-xl border border-border/60 bg-background/40 p-4">
      <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
        {props.stat.label}
      </div>
      <div class="mt-1 flex items-center justify-between">
        <span class="font-heading text-2xl tracking-tight">{props.stat.value}</span>
        <span
          class={cn(
            "rounded px-1.5 py-0.5 font-mono text-[10px]",
            tones[props.stat.tone],
          )}
        >
          {props.stat.tone === "emerald"
            ? "good"
            : props.stat.tone === "amber"
              ? "watch"
              : "low"}
        </span>
      </div>
    </div>
  );
}
