import { onCleanup } from "solid-js";
import type {
  BubbleDataPoint,
  ChartConfiguration,
  Chart as ChartInstance,
  Plugin,
  TooltipModel,
} from "chart.js";
import { cn } from "../../lib/utils";
import { chartEntryAnimation } from "./_animation";
import { createChart } from "./_chart-lifecycle";
import { readChartTheme, type ChartTheme } from "./_theme";
import { removeChartTooltip, renderChartTooltip } from "./_tooltip";

export interface ScatterBubblePoint {
  highlight?: boolean;
  name: string;
  size: number;
  x: number;
  y: number;
}

export interface ScatterBubbleChartProps {
  class?: string;
  footerLabel?: string;
  footerValue?: string;
  points: readonly ScatterBubblePoint[];
  xLabel?: string;
  yLabel?: string;
}

export function ScatterBubbleChart(props: ScatterBubbleChartProps) {
  return (
    <div
      data-chart-tooltip-root=""
      class={cn(
        "relative overflow-visible rounded-xl border border-border/60 bg-background/40 p-6",
        props.class,
      )}
    >
      <ScatterBubbleCanvas points={props.points} />
      <div class="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
        <span>{props.footerLabel ?? "satisfaction (NPS proxy)"}</span>
        <span>{props.footerValue ?? ""}</span>
      </div>
    </div>
  );
}

function ScatterBubbleCanvas(props: { points: readonly ScatterBubblePoint[] }) {
  let canvas!: HTMLCanvasElement;
  createChart<"bubble", BubbleDataPoint[], string>(
    () => canvas,
    () => createChartConfig(props.points),
  );

  onCleanup(() => {
    removeChartTooltip(canvas?.parentElement ?? null, "scatter-bubble");
  });

  return (
    <div class="relative h-96">
      <canvas ref={canvas} aria-label="Scatter bubble chart" role="img" />
    </div>
  );
}

function createChartConfig(
  points: readonly ScatterBubblePoint[],
): ChartConfiguration<"bubble", BubbleDataPoint[], string> {
  const theme = readChartTheme();
  const primaryColor = theme.palette[0] ?? "rgb(29 78 216)";
  const colors = points.map((point) =>
    isRisk(point) ? "rgb(244 63 94)" : primaryColor,
  );
  const maxSize = Math.max(...points.map((point) => point.size), 1);

  return {
    type: "bubble",
    data: {
      datasets: [
        {
          label: "accounts",
          data: points.map((point) => ({
            x: point.x,
            y: point.y,
            r: 5 + (point.size / maxSize) * 12,
          })),
          backgroundColor: colors.map((color) => alpha(color, 0.2)),
          borderColor: colors,
          borderWidth: 1.5,
          hoverBackgroundColor: colors.map((color) => alpha(color, 0.28)),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: chartEntryAnimation(),
      interaction: { intersect: true, mode: "nearest" },
      layout: { padding: { top: 16, right: 24, left: 0, bottom: 8 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external(context) {
            renderExternalTooltip(context, theme, points, colors);
          },
        },
      },
      scales: {
        x: {
          min: 1,
          max: 10,
          border: { display: false },
          grid: { display: false },
          ticks: {
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
            callback(value) {
              return `${Number(value)}`;
            },
          },
        },
        y: {
          min: 0,
          max: 100,
          border: { display: false },
          grid: { display: false, drawTicks: false },
          ticks: {
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
            padding: 10,
            callback(value) {
              return `${Number(value)}%`;
            },
          },
        },
      },
    },
    plugins: [createRiskZonePlugin(theme), createLabelPlugin(theme, points)],
  };
}

function createRiskZonePlugin(theme: ChartTheme): Plugin<"bubble"> {
  return {
    id: "scatterRiskZone",
    beforeDatasetsDraw(chart) {
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      const ctx = chart.ctx;
      const left = xScale.getPixelForValue(1);
      const right = xScale.getPixelForValue(5.5);
      const top = yScale.getPixelForValue(50);
      const bottom = yScale.getPixelForValue(0);
      const xMid = xScale.getPixelForValue(5.5);
      const yMid = yScale.getPixelForValue(50);

      ctx.save();
      ctx.fillStyle = "rgba(244, 63, 94, 0.06)";
      ctx.fillRect(left, top, right - left, bottom - top);
      ctx.strokeStyle = theme.connector;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(xMid, chart.chartArea.top);
      ctx.lineTo(xMid, chart.chartArea.bottom);
      ctx.moveTo(chart.chartArea.left, yMid);
      ctx.lineTo(chart.chartArea.right, yMid);
      ctx.stroke();
      ctx.restore();
    },
  };
}

function createLabelPlugin(
  theme: ChartTheme,
  points: readonly ScatterBubblePoint[],
): Plugin<"bubble"> {
  return {
    id: "scatterLabels",
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      const ctx = chart.ctx;

      ctx.save();
      ctx.fillStyle = theme.foreground;
      ctx.font = `10px ${theme.monoFont}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      meta.data.forEach((element, index) => {
        const point = points[index];
        if (!point?.highlight) return;

        const props = element.getProps(["x", "y"], true);
        ctx.fillText(point.name, props.x + 12, props.y);
      });

      ctx.restore();
    },
  };
}

function renderExternalTooltip(
  context: {
    chart: ChartInstance;
    tooltip: TooltipModel<"bubble">;
  },
  theme: ChartTheme,
  points: readonly ScatterBubblePoint[],
  colors: readonly string[],
) {
  const dataPoint = context.tooltip.dataPoints[0];
  const point = dataPoint ? points[dataPoint.dataIndex] : undefined;

  renderChartTooltip({
    context,
    id: "scatter-bubble",
    sansFont: theme.sansFont,
    content:
      point && dataPoint
        ? {
            activeKey: String(dataPoint.dataIndex),
            title: point.name,
            rows: [
              {
                color: colors[dataPoint.dataIndex] ?? theme.foreground,
                label: "satisfaction",
                value: point.x.toFixed(1),
              },
              {
                color: colors[dataPoint.dataIndex] ?? theme.foreground,
                label: "retention",
                value: `${point.y}%`,
              },
              {
                color: colors[dataPoint.dataIndex] ?? theme.foreground,
                label: "MRR",
                value: point.size.toLocaleString(),
              },
            ],
          }
        : undefined,
  });
}

function isRisk(point: ScatterBubblePoint) {
  return point.x < 5.5 && point.y < 50;
}

function alpha(color: string, opacity: number) {
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }
  return color;
}
