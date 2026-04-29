import {
  createEffect,
  createSignal,
  onCleanup,
  type Accessor,
} from "solid-js";
import type {
  ChartConfiguration,
  Chart as ChartInstance,
  Plugin,
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
        backgroundColor: "transparent",
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.38,
      })),
    },
    plugins: [createStackedAreaGradientPlugin(colors)],
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

function createStackedAreaGradientPlugin(colors: readonly string[]): Plugin<"line"> {
  return {
    id: "orbitRevenueAreaFill",
    beforeDatasetsDraw(chart) {
      const { chartArea, ctx, scales } = chart;
      if (!chartArea) return;
      const yScale = scales.y;
      if (!yScale) return;

      const baselineY = yScale.getPixelForValue(0);

      chart.data.datasets.forEach((_, index) => {
        const color = colors[index];
        if (!color) return;

        const meta = chart.getDatasetMeta(index);
        if (meta.hidden || meta.data.length === 0) return;

        const topPoints = meta.data.map(readPoint);
        const lowerPoints =
          index === 0
            ? topPoints.map((point) => ({ x: point.x, y: baselineY }))
            : chart.getDatasetMeta(index - 1).data.map(readPoint);

        ctx.save();
        ctx.beginPath();
        topPoints.forEach((point, pointIndex) => {
          if (pointIndex === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        [...lowerPoints].reverse().forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fillStyle = createAreaGradient(chart, color);
        ctx.fill();
        ctx.restore();
      });
    },
  };
}

function readPoint(point: unknown) {
  const position = point as { x: number; y: number };
  return { x: position.x, y: position.y };
}

function createAreaGradient(chart: ChartInstance, color: string) {
  const { chartArea, ctx } = chart;

  if (!chartArea) {
    return alpha(color, 0.7);
  }

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, alpha(color, 0.7));
  gradient.addColorStop(1, alpha(color, 0.1));

  return gradient;
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
  const rgb = parseRgb(color);
  if (rgb) {
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity})`;
  }

  const oklch = parseOklch(color);
  if (oklch) {
    return `rgba(${oklch.red}, ${oklch.green}, ${oklch.blue}, ${opacity})`;
  }

  if (color.startsWith("hsl(")) {
    const channels = color.slice(4, -1).trim();
    return `hsl(${channels} / ${opacity})`;
  }

  if (color.startsWith("hsla(")) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
  }

  if (color.startsWith("color(")) {
    return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
  }

  if (color.startsWith("#")) {
    return hexToRgb(color, opacity) ?? color;
  }

  return color;
}

function parseRgb(color: string) {
  const match = color.match(
    /^rgba?\(\s*([\d.]+)(?:,|\s)\s*([\d.]+)(?:,|\s)\s*([\d.]+)(?:\s*(?:,|\/)\s*[\d.%]+)?\s*\)$/i,
  );

  if (!match) return undefined;

  return {
    red: Number(match[1]),
    green: Number(match[2]),
    blue: Number(match[3]),
  };
}

function parseOklch(color: string) {
  const match = color.match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*[\d.%]+)?\s*\)$/i,
  );

  if (!match) return undefined;

  const lightness = parseCssNumber(match[1]!);
  const chroma = Number(match[2]);
  const hue = (Number(match[3]) * Math.PI) / 180;
  if ([lightness, chroma, hue].some((value) => Number.isNaN(value))) return undefined;

  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return {
    red: toSrgbChannel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    green: toSrgbChannel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    blue: toSrgbChannel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

function parseCssNumber(value: string) {
  return value.endsWith("%") ? Number(value.slice(0, -1)) / 100 : Number(value);
}

function toSrgbChannel(value: number) {
  const clamped = Math.min(1, Math.max(0, value));
  const encoded =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055;

  return Math.round(encoded * 255);
}

function hexToRgb(color: string, opacity: number) {
  const value = color.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((item) => `${item}${item}`)
          .join("")
      : value;

  if (normalized.length !== 6) return undefined;

  const numeric = Number.parseInt(normalized, 16);
  if (Number.isNaN(numeric)) return undefined;

  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
