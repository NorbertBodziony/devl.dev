import type { ChartConfiguration } from "chart.js";
import { cn } from "../../lib/utils";
import { createChart } from "./_chart-lifecycle";

export interface GaugeGridItem {
  detail: string;
  name: string;
  percent: number;
  status: "breached" | "on-track";
  target: string;
  unit: string;
  value: number | string;
}

export interface GaugeGridProps {
  class?: string;
  gauges: readonly GaugeGridItem[];
}

export function GaugeGrid(props: GaugeGridProps) {
  return (
    <div class={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", props.class)}>
      {props.gauges.map((gauge) => (
        <GaugeCard gauge={gauge} />
      ))}
    </div>
  );
}

function GaugeCard(props: { gauge: GaugeGridItem }) {
  const ringColor = () =>
    props.gauge.status === "breached"
      ? "rgb(244 63 94)"
      : props.gauge.percent > 0.85
        ? "rgb(245 158 11)"
        : "rgb(20 184 166)";
  const tone = () =>
    props.gauge.status === "breached"
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div class="rounded-xl border border-border/60 bg-background/40 p-5">
      <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
        {props.gauge.name}
      </div>

      <div class="relative mt-3 grid place-items-center">
        <GaugeCanvas color={ringColor()} percent={props.gauge.percent} />
        <div class="pointer-events-none absolute inset-0 grid place-items-center">
          <div class="text-center">
            <div class="font-heading text-3xl tracking-tight">
              {props.gauge.value}
              <span class="ml-0.5 text-muted-foreground text-sm">
                {props.gauge.unit}
              </span>
            </div>
            <div class={cn("font-mono text-[10px] uppercase tracking-[0.2em]", tone())}>
              {props.gauge.status === "breached" ? "breached" : "on track"}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span class="text-muted-foreground">target {props.gauge.target}</span>
        <span class="text-foreground/80">
          {Math.round(props.gauge.percent * 100)}% of target
        </span>
      </div>
      <div class="mt-2 text-muted-foreground text-xs">{props.gauge.detail}</div>
    </div>
  );
}

function GaugeCanvas(props: { color: string; percent: number }) {
  let canvas!: HTMLCanvasElement;
  createChart<"doughnut", number[], string>(
    () => canvas,
    () => createChartConfig(props.percent, props.color),
  );

  return (
    <div class="h-44 w-44">
      <canvas ref={canvas} aria-label="Gauge chart" role="img" />
    </div>
  );
}

function createChartConfig(
  percent: number,
  color: string,
): ChartConfiguration<"doughnut", number[], string> {
  return {
    type: "doughnut",
    data: {
      labels: ["progress", "remaining"],
      datasets: [
        {
          data: [
            Math.max(0, Math.min(1, percent)) * 100,
            (1 - Math.max(0, Math.min(1, percent))) * 100,
          ],
          backgroundColor: [color, "rgba(127, 127, 127, 0.12)"],
          borderWidth: 0,
          borderRadius: 8,
          circumference: 288,
          rotation: -234,
          spacing: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      cutout: "78%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
  };
}
