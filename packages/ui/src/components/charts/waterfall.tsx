import { onCleanup } from "solid-js";
import type {
  ChartConfiguration,
  Chart as ChartInstance,
  Plugin,
  TooltipModel,
} from "chart.js";
import { cn } from "../../lib/utils";
import { createChart } from "./_chart-lifecycle";
import { formatSignedNumber } from "./_format";
import { readChartTheme, type ChartTheme } from "./_theme";
import { removeChartTooltip, renderChartTooltip } from "./_tooltip";

export interface WaterfallStep {
  label: string;
  type: "delta" | "end" | "start";
  value: number;
}

interface WaterfallBar {
  color: string;
  end: number;
  label: string;
  start: number;
  type: WaterfallStep["type"];
  value: number;
}

export interface WaterfallChartProps {
  class?: string;
  nrrLabel?: string;
  steps: readonly WaterfallStep[];
  valueFormatter?: (bar: WaterfallBar) => string;
  yMax?: number;
}

const BAR_COLORS = {
  addition: "rgb(16 185 129)",
  loss: "rgb(244 63 94)",
  total: "rgb(82 82 91)",
};

export function WaterfallChart(props: WaterfallChartProps) {
  const bars = () => buildBars(props.steps);
  const formatValue = (bar: WaterfallBar) =>
    props.valueFormatter?.(bar) ??
    (bar.type === "delta" ? formatSignedNumber(bar.value) : `${bar.value}`);

  return (
    <div
      class={cn(
        "rounded-xl border border-border/60 bg-background/40 p-6",
        props.class,
      )}
    >
      <div class="mb-3 flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
        <span class="flex items-center gap-1.5">
          <span class="size-2.5 rounded-sm bg-foreground/70" />
          start / end
        </span>
        <span class="flex items-center gap-1.5">
          <span class="size-2.5 rounded-sm bg-emerald-500" />
          addition
        </span>
        <span class="flex items-center gap-1.5">
          <span class="size-2.5 rounded-sm bg-rose-500" />
          loss
        </span>
        {props.nrrLabel ? (
          <span class="ml-auto text-foreground">{props.nrrLabel}</span>
        ) : null}
      </div>

      <WaterfallCanvas
        bars={bars()}
        formatValue={formatValue}
        yMax={props.yMax}
      />
    </div>
  );
}

function WaterfallCanvas(props: {
  bars: readonly WaterfallBar[];
  formatValue: (bar: WaterfallBar) => string;
  yMax?: number;
}) {
  let canvas!: HTMLCanvasElement;
  createChart<"bar", Array<[number, number]>, string>(
    () => canvas,
    () => createChartConfig(props.bars, props.formatValue, props.yMax),
  );

  onCleanup(() => {
    removeChartTooltip(canvas?.parentElement ?? null, "waterfall");
  });

  return (
    <div class="overflow-x-auto pb-1">
      <div class="relative h-80 min-w-[620px]">
        <canvas ref={canvas} aria-label="Waterfall chart" role="img" />
      </div>
    </div>
  );
}

function buildBars(steps: readonly WaterfallStep[]): WaterfallBar[] {
  let running = 0;

  return steps.map((step) => {
    if (step.type === "start") {
      running = step.value;
      return {
        color: BAR_COLORS.total,
        end: step.value,
        label: step.label,
        start: 0,
        type: step.type,
        value: step.value,
      };
    }

    if (step.type === "end") {
      return {
        color: BAR_COLORS.total,
        end: step.value,
        label: step.label,
        start: 0,
        type: step.type,
        value: step.value,
      };
    }

    const start = running;
    running += step.value;

    return {
      color: step.value >= 0 ? BAR_COLORS.addition : BAR_COLORS.loss,
      end: running,
      label: step.label,
      start,
      type: step.type,
      value: step.value,
    };
  });
}

function createChartConfig(
  bars: readonly WaterfallBar[],
  formatValue: (bar: WaterfallBar) => string,
  yMax?: number,
): ChartConfiguration<"bar", Array<[number, number]>, string> {
  const theme = readChartTheme();

  return {
    type: "bar",
    data: {
      labels: bars.map((bar) => bar.label),
      datasets: [
        {
          data: bars.map((bar) => [
            Math.min(bar.start, bar.end),
            Math.max(bar.start, bar.end),
          ]),
          backgroundColor: bars.map((bar) => bar.color),
          borderColor: bars.map((bar) => bar.color),
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.72,
          categoryPercentage: 0.74,
          hoverBackgroundColor: bars.map((bar) => bar.color),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      layout: {
        padding: {
          top: 24,
          right: 8,
          bottom: 0,
          left: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external(context) {
            renderExternalTooltip(context, theme, bars, formatValue);
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            autoSkip: false,
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: {
            color: theme.grid,
            drawTicks: false,
          },
          max: yMax,
          ticks: {
            color: theme.foreground,
            font: { family: theme.monoFont, size: 10 },
            padding: 10,
            stepSize: 500,
            callback(value) {
              return `${Number(value)}`;
            },
          },
        },
      },
    },
    plugins: [
      createConnectorPlugin(theme, bars),
      createHoverGuidePlugin(theme),
      createValueLabelPlugin(theme, bars, formatValue),
    ],
  };
}

function createConnectorPlugin(
  theme: ChartTheme,
  bars: readonly WaterfallBar[],
): Plugin<"bar"> {
  return {
    id: "waterfallConnectors",
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      const yScale = chart.scales.y;
      const ctx = chart.ctx;

      ctx.save();
      ctx.strokeStyle = theme.connector;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);

      for (let i = 1; i < bars.length; i += 1) {
        const previous = meta.data[i - 1];
        const current = meta.data[i];
        const currentBar = bars[i];
        if (!previous || !current || !currentBar) continue;

        const previousProps = previous.getProps(["x", "width"], true);
        const currentProps = current.getProps(["x", "width"], true);
        const y = yScale.getPixelForValue(currentBar.start);

        ctx.beginPath();
        ctx.moveTo(previousProps.x + previousProps.width / 2 + 5, y);
        ctx.lineTo(currentProps.x - currentProps.width / 2 - 5, y);
        ctx.stroke();
      }

      ctx.restore();
    },
  };
}

function createHoverGuidePlugin(theme: ChartTheme): Plugin<"bar"> {
  return {
    id: "waterfallHoverGuide",
    afterDatasetsDraw(chart) {
      const active = chart.getActiveElements()[0];
      if (!active) return;

      const element = chart.getDatasetMeta(active.datasetIndex).data[active.index];
      if (!element) return;

      const { x } = element.getProps(["x"], true);
      const { top, bottom } = chart.chartArea;
      const ctx = chart.ctx;

      ctx.save();
      ctx.strokeStyle = theme.connector;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.restore();
    },
  };
}

function createValueLabelPlugin(
  theme: ChartTheme,
  bars: readonly WaterfallBar[],
  formatValue: (bar: WaterfallBar) => string,
): Plugin<"bar"> {
  return {
    id: "waterfallValueLabels",
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      const ctx = chart.ctx;

      ctx.save();
      ctx.fillStyle = theme.foreground;
      ctx.font = `10px ${theme.monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      meta.data.forEach((element, index) => {
        const bar = bars[index];
        if (!bar) return;

        const props = element.getProps(["x", "y", "base"], true);
        const y = Math.min(props.y, props.base) - 8;

        ctx.fillText(formatValue(bar), props.x, y);
      });

      ctx.restore();
    },
  };
}

function renderExternalTooltip(
  context: {
    chart: ChartInstance;
    tooltip: TooltipModel<"bar">;
  },
  theme: ChartTheme,
  bars: readonly WaterfallBar[],
  formatValue: (bar: WaterfallBar) => string,
) {
  const dataPoint = context.tooltip.dataPoints[0];
  const bar = dataPoint ? bars[dataPoint.dataIndex] : undefined;

  renderChartTooltip({
    context,
    id: "waterfall",
    sansFont: theme.sansFont,
    content:
      bar && dataPoint
        ? {
            activeKey: String(dataPoint.dataIndex),
            title: bar.label,
            rows: [
              {
                color: bar.color,
                label: bar.type === "delta" ? "delta" : "value",
                value: formatValue(bar),
              },
            ],
          }
        : undefined,
  });
}
