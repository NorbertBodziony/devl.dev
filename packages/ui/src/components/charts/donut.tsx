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
import { formatNumber, formatPercent } from "./_format";
import { chartColorVar, readChartTheme, type ChartTheme } from "./_theme";
import { removeChartTooltip, renderChartTooltip } from "./_tooltip";

export interface DonutChartSlice {
  name: string;
  value: number;
}

export interface DonutChartProps {
  class?: string;
  revenueMultiplier?: number;
  slices: readonly DonutChartSlice[];
  totalLabel?: string;
  totalValue: string;
  trendLabel?: string;
  valueFormatter?: (value: number) => string;
}

export function DonutChart(props: DonutChartProps) {
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  const total = () => props.slices.reduce((acc, slice) => acc + slice.value, 0);
  const formatValue = (value: number) =>
    props.valueFormatter?.(value) ?? formatPercent(value);
  const handleLegendMove = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const row = target.closest<HTMLElement>("[data-slice-index]");
    const nextIndex = row ? Number(row.dataset.sliceIndex) : null;
    if (nextIndex === activeIndex()) return;

    setActiveIndex(Number.isInteger(nextIndex) ? nextIndex : null);
  };

  return (
    <div
      data-chart-tooltip-root=""
      class={cn(
        "relative overflow-visible rounded-xl border border-border/60 bg-background/40 p-6",
        props.class,
      )}
    >
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div class="relative grid place-items-center">
          <DonutCanvas
            activeIndex={activeIndex}
            slices={props.slices}
            valueFormatter={formatValue}
          />
          <div class="pointer-events-none absolute inset-0 grid place-items-center">
            <div class="text-center">
              <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                {props.totalLabel ?? "Total"}
              </div>
              <div class="mt-0.5 font-heading text-3xl tracking-tight">
                {props.totalValue}
              </div>
              {props.trendLabel ? (
                <div class="mt-1 font-mono text-[10px] text-emerald-600 uppercase tracking-[0.2em] dark:text-emerald-400">
                  {props.trendLabel}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <ul
          class="flex flex-col justify-center gap-3"
          onMouseMove={handleLegendMove}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {props.slices.map((slice, index) => {
            const color = chartColorVar(index);
            const revenue = props.revenueMultiplier
              ? props.revenueMultiplier * slice.value
              : undefined;

            return (
              <li data-slice-index={index} class="flex items-center gap-3">
                <span
                  class="size-3 shrink-0 rounded"
                  style={{ "background-color": color }}
                />
                <div class="flex-1">
                  <div class="flex items-baseline justify-between">
                    <span class="text-sm">{slice.name}</span>
                    <span class="font-mono text-muted-foreground text-xs tabular-nums">
                      {formatValue(slice.value)}
                    </span>
                  </div>
                  <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full"
                      style={{
                        "background-color": color,
                        width: `${(slice.value / total()) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                {revenue !== undefined ? (
                  <span class="w-16 text-right font-mono text-foreground text-xs tabular-nums">
                    ${formatNumber(revenue)}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function DonutCanvas(props: {
  activeIndex: Accessor<number | null>;
  slices: readonly DonutChartSlice[];
  valueFormatter: (value: number) => string;
}) {
  let canvas!: HTMLCanvasElement;
  const chart = createChart<"doughnut", number[], string>(
    () => canvas,
    () => createChartConfig(props.slices, props.valueFormatter),
    () => syncActiveSlice(),
  );

  createEffect(() => {
    syncActiveSlice();
  });

  onCleanup(() => {
    removeChartTooltip(canvas?.parentElement ?? null, "donut");
  });

  return (
    <div class="relative h-56 w-56">
      <canvas ref={canvas} aria-label="Revenue mix donut chart" role="img" />
    </div>
  );

  function syncActiveSlice() {
    const instance = chart();
    if (!instance) return;

    const index = props.activeIndex();
    if (index === null) {
      syncChartActiveElements(instance, []);
      return;
    }

    syncChartActiveElements(instance, [{ datasetIndex: 0, index }]);
  }
}

function createChartConfig(
  slices: readonly DonutChartSlice[],
  valueFormatter: (value: number) => string,
): ChartConfiguration<"doughnut", number[], string> {
  const theme = readChartTheme();

  return {
    type: "doughnut",
    data: {
      labels: slices.map((slice) => slice.name),
      datasets: [
        {
          data: slices.map((slice) => slice.value),
          backgroundColor: theme.palette,
          borderColor: theme.palette,
          borderWidth: 0,
          hoverBackgroundColor: theme.palette,
          hoverBorderWidth: 0,
          hoverOffset: 4,
          spacing: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: chartEntryAnimation(),
      cutout: "62.5%",
      layout: {
        padding: 16,
      },
      rotation: -90,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external(context) {
            renderExternalTooltip(context, theme, slices, valueFormatter);
          },
        },
      },
    },
  };
}

function renderExternalTooltip(
  context: {
    chart: ChartInstance;
    tooltip: TooltipModel<"doughnut">;
  },
  theme: ChartTheme,
  slices: readonly DonutChartSlice[],
  valueFormatter: (value: number) => string,
) {
  const dataPoint = context.tooltip.dataPoints[0];
  const slice = dataPoint ? slices[dataPoint.dataIndex] : undefined;
  const color = dataPoint
    ? theme.palette[dataPoint.dataIndex]
    : theme.palette[0];

  renderChartTooltip({
    context,
    id: "donut",
    sansFont: theme.sansFont,
    content:
      slice && dataPoint && color
        ? {
            activeKey: String(dataPoint.dataIndex),
            title: slice.name,
            rows: [
              {
                color,
                label: "share",
                value: valueFormatter(slice.value),
              },
            ],
          }
        : undefined,
  });
}
