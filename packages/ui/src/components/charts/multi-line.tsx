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

export interface MultiLineSeries {
  color?: string;
  key: string;
  name: string;
}

export type MultiLineDatum = Record<string, number | string>;

export interface MultiLineChartProps {
  class?: string;
  data: readonly MultiLineDatum[];
  labelKey: string;
  rangeLabel?: string;
  ranges?: readonly string[];
  series: readonly MultiLineSeries[];
  valueFormatter?: (value: number) => string;
}

export function MultiLineChart(props: MultiLineChartProps) {
  const [activeSeries, setActiveSeries] = createSignal<number | null>(null);
  const valueFormatter = props.valueFormatter ?? ((value: number) => value.toLocaleString());

  return (
    <div
      data-chart-tooltip-root=""
      class={cn(
        "relative overflow-visible rounded-xl border border-border/60 bg-background/40 p-6",
        props.class,
      )}
    >
      <div class="flex flex-wrap items-center gap-3">
        {props.series.map((series, index) => (
          <button
            onBlur={() => setActiveSeries(null)}
            onFocus={() => setActiveSeries(index)}
            onMouseEnter={() => setActiveSeries(index)}
            onMouseLeave={() => setActiveSeries(null)}
            type="button"
            class={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-xs transition-[background-color,opacity] hover:bg-foreground/[0.05]",
              activeSeries() === null || activeSeries() === index
                ? "opacity-100"
                : "opacity-45",
            )}
          >
            <span
              class="size-2 rounded-sm"
              style={{ "background-color": series.color ?? chartColorVar(index) }}
            />
            {series.name}
            <span class="font-mono text-[10px] text-muted-foreground">
              {valueFormatter(Number(props.data.at(-1)?.[series.key] ?? 0))}
            </span>
          </button>
        ))}
        {props.ranges ? (
          <div class="ml-auto flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
            {props.ranges.map((range) => (
              <button
                type="button"
                class={cn(
                  "rounded px-2 py-1 hover:bg-foreground/[0.05]",
                  range === props.rangeLabel ? "bg-foreground/[0.08]" : "",
                )}
              >
                {range}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <MultiLineCanvas
        activeSeries={activeSeries}
        data={props.data}
        labelKey={props.labelKey}
        series={props.series}
        valueFormatter={valueFormatter}
      />
    </div>
  );
}

function MultiLineCanvas(props: {
  activeSeries: Accessor<number | null>;
  data: readonly MultiLineDatum[];
  labelKey: string;
  series: readonly MultiLineSeries[];
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
    removeChartTooltip(canvas?.parentElement ?? null, "multi-line");
  });

  return (
    <div class="relative mt-4 h-72">
      <canvas ref={canvas} aria-label="Multi-line chart" role="img" />
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
  data: readonly MultiLineDatum[],
  labelKey: string,
  series: readonly MultiLineSeries[],
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
        backgroundColor: colors[index],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 0,
        tension: 0.38,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: chartEntryAnimation(),
      interaction: { intersect: false, mode: "index" },
      layout: { padding: { top: 8, right: 16, left: 0, bottom: 0 } },
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
            autoSkip: true,
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
            maxTicksLimit: 8,
          },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { display: false, drawTicks: false },
          ticks: {
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
            padding: 10,
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
    id: "multi-line",
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
