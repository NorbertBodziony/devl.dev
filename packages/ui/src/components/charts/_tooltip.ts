import type { Chart as ChartInstance, ChartType, TooltipModel } from "chart.js";

export interface ChartTooltipRow {
  color: string;
  label: string;
  value: string;
}

export interface ChartTooltipContent {
  activeKey: string;
  rows: readonly ChartTooltipRow[];
  title: string;
}

interface RenderChartTooltipOptions<TType extends ChartType> {
  context: {
    chart: ChartInstance;
    tooltip: TooltipModel<TType>;
  };
  content: ChartTooltipContent | undefined;
  id: string;
  sansFont: string;
  topOffset?: number;
}

const tooltipCloseTimers = new WeakMap<HTMLDivElement, number>();
const tooltipChangeTimers = new WeakMap<HTMLDivElement, number>();

export function renderChartTooltip<TType extends ChartType>({
  context,
  content,
  id,
  sansFont,
  topOffset = -10,
}: RenderChartTooltipOptions<TType>) {
  const { chart, tooltip } = context;
  const container = chart.canvas.parentElement;
  if (!container) return;

  const { tooltipEl, tooltipSurface } = ensureTooltip(container, id);

  if (tooltip.opacity === 0 || !content) {
    closeTooltip(tooltipSurface);
    return;
  }

  if (tooltipEl.dataset.activeKey !== content.activeKey) {
    animateTooltipChange(tooltipEl);
    tooltipEl.dataset.activeKey = content.activeKey;
  }

  openTooltip(tooltipSurface);
  tooltipSurface.replaceChildren();

  const title = document.createElement("div");
  title.className =
    "font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]";
  title.textContent = content.title;

  const list = document.createElement("ul");
  list.className = "mt-1 flex min-w-32 flex-col gap-1";

  for (const row of content.rows) {
    const item = document.createElement("li");
    item.className = "flex items-center gap-2";

    const dot = document.createElement("span");
    dot.setAttribute("aria-hidden", "true");
    dot.className = "size-2 rounded-full";
    dot.style.background = row.color;

    const label = document.createElement("span");
    label.className = "text-muted-foreground";
    label.textContent = row.label;

    const value = document.createElement("span");
    value.className = "ml-auto font-mono tabular-nums text-foreground";
    value.textContent = row.value;

    item.append(dot, label, value);
    list.append(item);
  }

  tooltipSurface.append(title, list);
  tooltipSurface.style.fontFamily = sansFont;
  tooltipEl.style.left = `${chart.canvas.offsetLeft + tooltip.caretX}px`;
  tooltipEl.style.top = `${chart.canvas.offsetTop + tooltip.caretY + topOffset}px`;
}

export function removeChartTooltip(container: HTMLElement | null, id: string) {
  const tooltipEl = container?.querySelector<HTMLDivElement>(
    `[data-chart-tooltip="${id}"]`,
  );
  tooltipEl?.remove();
}

function ensureTooltip(container: HTMLElement, id: string) {
  let tooltipEl = container.querySelector<HTMLDivElement>(
    `[data-chart-tooltip="${id}"]`,
  );
  let tooltipSurface = tooltipEl?.querySelector<HTMLDivElement>(
    "[data-chart-tooltip-surface]",
  );

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.dataset.chartTooltip = id;
    tooltipEl.className = "t-chart-tooltip-shell pointer-events-none absolute z-10";
    container.appendChild(tooltipEl);
  }

  if (!tooltipSurface) {
    tooltipEl.replaceChildren();
    tooltipEl.className = "t-chart-tooltip-shell pointer-events-none absolute z-10";
    tooltipSurface = document.createElement("div");
    tooltipSurface.dataset.chartTooltipSurface = "";
    tooltipSurface.dataset.origin = "top-center";
    tooltipSurface.className =
      "t-dropdown rounded-lg border border-border/70 bg-background/95 px-3 py-2 text-foreground text-xs shadow-lg backdrop-blur";
    tooltipEl.appendChild(tooltipSurface);
  }

  return { tooltipEl, tooltipSurface };
}

function animateTooltipChange(tooltipEl: HTMLDivElement) {
  const timer = tooltipChangeTimers.get(tooltipEl);
  if (timer !== undefined) {
    window.clearTimeout(timer);
  }

  tooltipEl.classList.add("is-changing");
  const nextTimer = window.setTimeout(() => {
    tooltipEl.classList.remove("is-changing");
    tooltipChangeTimers.delete(tooltipEl);
  }, 180);
  tooltipChangeTimers.set(tooltipEl, nextTimer);
}

function openTooltip(tooltipEl: HTMLDivElement) {
  const timer = tooltipCloseTimers.get(tooltipEl);
  if (timer !== undefined) {
    window.clearTimeout(timer);
    tooltipCloseTimers.delete(tooltipEl);
  }

  tooltipEl.classList.remove("is-closing");
  tooltipEl.classList.add("is-open");
}

function closeTooltip(tooltipEl: HTMLDivElement) {
  if (!tooltipEl.classList.contains("is-open")) return;

  tooltipEl.classList.remove("is-open");
  tooltipEl.classList.add("is-closing");

  const closeMs =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--dropdown-close-dur",
      ),
    ) || 150;

  const timer = window.setTimeout(() => {
    tooltipEl.classList.remove("is-closing");
    tooltipCloseTimers.delete(tooltipEl);
  }, closeMs);
  tooltipCloseTimers.set(tooltipEl, timer);
}
