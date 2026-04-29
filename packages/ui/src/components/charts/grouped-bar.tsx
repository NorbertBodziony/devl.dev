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
import { lastNumericIndex, syncChartActiveElements } from "./_active";
import { chartEntryAnimation } from "./_animation";
import { createChart } from "./_chart-lifecycle";
import {
  chartColorVar,
  readChartTheme,
  resolveCssColor,
  type ChartTheme,
} from "./_theme";
import { removeChartTooltip, renderChartTooltip } from "./_tooltip";

export interface GroupedBarSeries {
  color?: string;
  key: string;
  name: string;
}

export type GroupedBarDatum = Record<string, number | string | null>;

export interface GroupedBarChartProps {
  class?: string;
  data: readonly GroupedBarDatum[];
  labelKey: string;
  note?: string;
  series: readonly GroupedBarSeries[];
  valueFormatter?: (value: number) => string;
}

export function GroupedBarChart(props: GroupedBarChartProps) {
  const [activeSeries, setActiveSeries] = createSignal<number | null>(null);
  const valueFormatter = props.valueFormatter ?? ((value: number) => `${value}`);

  return (
    <div
      data-chart-tooltip-root=""
      class={cn(
        "relative overflow-visible rounded-xl border border-border/60 bg-background/40 p-6",
        props.class,
      )}
    >
      <div class="flex items-center justify-between gap-4">
        <div
          class="flex flex-wrap items-center gap-2"
          onMouseLeave={() => setActiveSeries(null)}
        >
          {props.series.map((series, index) => (
            <button
              class={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded px-1.5 text-muted-foreground text-xs transition-opacity hover:bg-foreground/[0.04]",
                activeSeries() === null || activeSeries() === index
                  ? "opacity-100"
                  : "opacity-45",
              )}
              onBlur={() => setActiveSeries(null)}
              onMouseEnter={() => setActiveSeries(index)}
              onFocus={() => setActiveSeries(index)}
              type="button"
            >
              <span
                class="size-2.5 rounded-sm"
                style={{ "background-color": series.color ?? chartColorVar(index) }}
              />
              {series.name}
            </button>
          ))}
        </div>
        {props.note ? (
          <span class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
            {props.note}
          </span>
        ) : null}
      </div>

      <GroupedBarCanvas
        data={props.data}
        activeSeries={activeSeries}
        labelKey={props.labelKey}
        series={props.series}
        valueFormatter={valueFormatter}
      />
    </div>
  );
}

function GroupedBarCanvas(props: {
  activeSeries: Accessor<number | null>;
  data: readonly GroupedBarDatum[];
  labelKey: string;
  series: readonly GroupedBarSeries[];
  valueFormatter: (value: number) => string;
}) {
  let canvas!: HTMLCanvasElement;
  const chart = createChart<"bar", Array<number | null>, string>(
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
    removeChartTooltip(canvas?.parentElement ?? null, "grouped-bar");
  });

  return (
    <div class="relative mt-4 h-72">
      <canvas ref={canvas} aria-label="Grouped bar chart" role="img" />
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

    const values = props.data.map((row) => row[props.series[datasetIndex]?.key ?? ""]);
    const index = lastNumericIndex(values);
    if (index < 0) {
      syncChartActiveElements(instance, []);
      return;
    }

    syncChartActiveElements(instance, [{ datasetIndex, index }]);
  }
}

function createChartConfig(
  data: readonly GroupedBarDatum[],
  labelKey: string,
  series: readonly GroupedBarSeries[],
  valueFormatter: (value: number) => string,
): ChartConfiguration<"bar", Array<number | null>, string> {
  const theme = readChartTheme();
  const colors = series.map((item, index) => {
    const fallback = theme.palette[index % theme.palette.length]!;
    return item.color ? resolveCssColor(item.color, fallback) : fallback;
  });

  return {
    type: "bar",
    data: {
      labels: data.map((row) => String(row[labelKey])),
      datasets: series.map((item, index) => ({
        label: item.name,
        data: data.map((row) => toNumberOrNull(row[item.key])),
        backgroundColor: colors[index],
        borderColor: colors[index],
        borderRadius: 3,
        borderSkipped: false,
        barPercentage: 0.72,
        categoryPercentage: 0.74,
        hoverBackgroundColor: colors[index],
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: chartEntryAnimation(),
      interaction: {
        intersect: false,
        mode: "index",
      },
      layout: {
        padding: { top: 16, right: 8, bottom: 0, left: 0 },
      },
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
    tooltip: TooltipModel<"bar">;
  },
  theme: ChartTheme,
  colors: readonly string[],
  valueFormatter: (value: number) => string,
) {
  const dataPoint = context.tooltip.dataPoints[0];
  const label = dataPoint?.label;
  const rows = context.tooltip.dataPoints
    .filter((point) => point.raw !== null)
    .map((point) => ({
      color: colors[point.datasetIndex] ?? theme.foreground,
      label: point.dataset.label ?? "value",
      value: valueFormatter(Number(point.raw)),
    }));

  renderChartTooltip({
    context,
    id: "grouped-bar",
    sansFont: theme.sansFont,
    content:
      dataPoint && rows.length > 0
        ? {
            activeKey: String(dataPoint.dataIndex),
            title: label ?? "",
            rows,
          }
        : undefined,
  });
}

function toNumberOrNull(value: number | string | null | undefined) {
  return typeof value === "number" ? value : null;
}
