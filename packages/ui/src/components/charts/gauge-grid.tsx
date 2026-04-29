import { cn } from "../../lib/utils";

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

const GAUGE_START_ANGLE = 144;
const GAUGE_SWEEP = 252;
const GAUGE_VIEWBOX_SIZE = 176;
const GAUGE_CENTER = GAUGE_VIEWBOX_SIZE / 2;
const GAUGE_RADIUS = 72;

export function GaugeGrid(props: GaugeGridProps) {
  return (
    <div class={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", props.class)}>
      {props.gauges.map((gauge, index) => (
        <GaugeCard entryIndex={index} gauge={gauge} />
      ))}
    </div>
  );
}

function GaugeCard(props: { entryIndex: number; gauge: GaugeGridItem }) {
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
    <div
      class="t-chart-entry-item rounded-xl border border-border/60 bg-background/40 p-5"
      style={{ "--chart-entry-index": String(props.entryIndex) }}
    >
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
  const arcPath = () =>
    describeArc(GAUGE_CENTER, GAUGE_CENTER, GAUGE_RADIUS, GAUGE_START_ANGLE, GAUGE_START_ANGLE + GAUGE_SWEEP);
  const targetLength = () => `${Math.max(0, Math.min(100, props.percent * 100))}`;

  return (
    <svg
      aria-label="Gauge chart"
      class="h-44 w-44 overflow-visible"
      role="img"
      viewBox={`0 0 ${GAUGE_VIEWBOX_SIZE} ${GAUGE_VIEWBOX_SIZE}`}
    >
      <path
        d={arcPath()}
        fill="none"
        pathLength="100"
        stroke="rgba(127, 127, 127, 0.12)"
        stroke-linecap="round"
        stroke-width="16"
      />
      <path
        class="t-gauge-ring-progress"
        d={arcPath()}
        fill="none"
        pathLength="100"
        stroke={props.color}
        stroke-linecap="round"
        stroke-width="16"
        style={{ "--gauge-target": targetLength() }}
      />
    </svg>
  );
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
