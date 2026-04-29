import {
  createEffect,
  createSignal,
  onCleanup,
  type Accessor,
} from "solid-js";
import type {
  ChartConfiguration,
  Chart as ChartInstance,
  TooltipModel,
} from "chart.js";
import { TrendingUpIcon } from "lucide-solid";
import { cn } from "../../lib/utils";
import { syncChartActiveElements } from "./_active";
import { chartEntryAnimation } from "./_animation";
import { createChart } from "./_chart-lifecycle";
import {
  chartColorVar,
  readChartTheme,
  resolveCssColor,
  type ChartTheme,
} from "./_theme";
import { removeChartTooltip, renderChartTooltip } from "./_tooltip";

export interface RevenueAreaSeries {
  color?: string;
  key: string;
  name: string;
}

export type RevenueAreaDatum = Record<string, number | string>;

export interface RevenueAreaChartProps {
  badge?: string;
  class?: string;
  data: readonly RevenueAreaDatum[];
  labelKey: string;
  metric: string;
  series: readonly RevenueAreaSeries[];
  valueFormatter?: (value: number) => string;
}

export function RevenueAreaChart(props: RevenueAreaChartProps) {
  const [activeSeries, setActiveSeries] = createSignal<number | null>(null);
  const valueFormatter = props.valueFormatter ?? ((value: number) => `${value}k`);

  return (
    <div
      data-chart-tooltip-root=""
      class={cn(
        "relative overflow-visible rounded-xl border border-border/60 bg-background/40 p-6",
        props.class,
      )}
    >
      <div class="flex items-end justify-between gap-4">
        <div>
          <div class="font-heading text-3xl tracking-tight">{props.metric}</div>
          {props.badge ? (
            <div class="mt-1 inline-flex items-center gap-1 rounded bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
              <TrendingUpIcon class="size-3" />
              {props.badge}
            </div>
          ) : null}
        </div>
        <div class="flex flex-wrap items-center justify-end gap-2">
          {props.series.map((series, index) => (
            <button
              class={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded px-1.5 text-muted-foreground text-xs transition-[background-color,opacity] hover:bg-foreground/[0.04]",
                activeSeries() === null || activeSeries() === index
                  ? "opacity-100"
                  : "opacity-45",
              )}
              onBlur={() => setActiveSeries(null)}
              onFocus={() => setActiveSeries(index)}
              onMouseEnter={() => setActiveSeries(index)}
              onMouseLeave={() => setActiveSeries(null)}
              type="button"
            >
              <span
                class="size-2 rounded-sm"
                style={{ "background-color": series.color ?? chartColorVar(index) }}
              />
              {series.name}
            </button>
          ))}
        </div>
      </div>

      <RevenueAreaCanvas
        activeSeries={activeSeries}
        data={props.data}
        labelKey={props.labelKey}
        series={props.series}
        valueFormatter={valueFormatter}
      />
    </div>
  );
}

function RevenueAreaCanvas(props: {
  activeSeries: Accessor<number | null>;
  data: readonly RevenueAreaDatum[];
  labelKey: string;
  series: readonly RevenueAreaSeries[];
  valueFormatter: (value: number) => string;
}) {
  let canvas!: HTMLCanvasElement;
  const chart = createChart<"line", number[], string>(
    () => canvas,
    () =>
      createChartConfig(
        props.data,
        props.labelKey,
        props.series,
        props.valueFormatter,
      ),
    () => syncActiveSeries(),
  );

  createEffect(() => {
    syncActiveSeries();
  });

  onCleanup(() => {
    removeChartTooltip(canvas?.parentElement ?? null, "revenue-area");
  });

  return (
    <div class="relative mt-4 h-72">
      <canvas ref={canvas} aria-label="Revenue area chart" role="img" />
    </div>
  );

  function syncActiveSeries() {
    const instance = chart();
    if (!instance) return;

    const datasetIndex = props.activeSeries();
    if (datasetIndex === null) {
      syncChartActiveElements(instance, []);
      return;
    }

    syncChartActiveElements(instance, [
      { datasetIndex, index: props.data.length - 1 },
    ]);
  }
}

function createChartConfig(
  data: readonly RevenueAreaDatum[],
  labelKey: string,
  series: readonly RevenueAreaSeries[],
  valueFormatter: (value: number) => string,
): ChartConfiguration<"line", number[], string> {
  const theme = readChartTheme();
  const colors = series.map((item, index) => {
    const fallback = theme.palette[index % theme.palette.length]!;
    return item.color ? resolveCssColor(item.color, fallback) : fallback;
  });

  return {
    type: "line",
    data: {
      labels: data.map((row) => String(row[labelKey])),
      datasets: series.map((item, index) => ({
        label: item.name,
        data: data.map((row) => Number(row[item.key] ?? 0)),
        borderColor: colors[index],
        backgroundColor: alpha(colors[index]!, 0.2),
        borderWidth: 1.5,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.38,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: chartEntryAnimation(),
      interaction: { intersect: false, mode: "index" },
      layout: { padding: { top: 8, right: 8, left: 0, bottom: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external(context) {
            renderExternalTooltip(context, theme, colors, valueFormatter);
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
          },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { display: false, drawTicks: false },
          stacked: true,
          ticks: {
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
            padding: 10,
            callback(value) {
              return valueFormatter(Number(value));
            },
          },
        },
      },
    },
  };
}

function renderExternalTooltip(
  context: {
    chart: ChartInstance;
    tooltip: TooltipModel<"line">;
  },
  theme: ChartTheme,
  colors: readonly string[],
  valueFormatter: (value: number) => string,
) {
  const dataPoint = context.tooltip.dataPoints[0];
  const rows = context.tooltip.dataPoints.map((point) => ({
    color: colors[point.datasetIndex] ?? theme.foreground,
    label: point.dataset.label ?? "value",
    value: valueFormatter(Number(point.raw)),
  }));

  renderChartTooltip({
    context,
    id: "revenue-area",
    sansFont: theme.sansFont,
    content:
      dataPoint && rows.length > 0
        ? {
            activeKey: String(dataPoint.dataIndex),
            title: dataPoint.label,
            rows,
          }
        : undefined,
  });
}

function alpha(color: string, opacity: number) {
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }
  return color;
}
