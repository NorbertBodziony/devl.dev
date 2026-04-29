export const CHART_COLOR_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

const LIGHT_FALLBACK_COLORS = [
  "rgb(234 88 12)",
  "rgb(13 148 136)",
  "rgb(22 78 99)",
  "rgb(251 191 36)",
  "rgb(245 158 11)",
];

const DARK_FALLBACK_COLORS = [
  "rgb(29 78 216)",
  "rgb(16 185 129)",
  "rgb(245 158 11)",
  "rgb(168 85 247)",
  "rgb(244 63 94)",
];

export interface ChartTheme {
  connector: string;
  foreground: string;
  grid: string;
  monoFont: string;
  mutedForeground: string;
  palette: string[];
  sansFont: string;
}

export function readChartTheme(): ChartTheme {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const dark = root.classList.contains("dark");
  const fallbacks = dark ? DARK_FALLBACK_COLORS : LIGHT_FALLBACK_COLORS;
  const monoFont =
    style.getPropertyValue("--font-mono").trim() ||
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const sansFont =
    style.getPropertyValue("--font-sans").trim() ||
    "Inter, ui-sans-serif, system-ui, sans-serif";

  return {
    connector: dark ? "rgba(255, 255, 255, 0.22)" : "rgba(0, 0, 0, 0.22)",
    foreground: dark ? "rgb(245 245 245)" : "rgb(39 39 42)",
    grid: dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    monoFont,
    mutedForeground: dark ? "rgb(163 163 163)" : "rgb(82 82 91)",
    palette: CHART_COLOR_VARS.map((color, index) =>
      resolveCssColor(color, fallbacks[index] ?? color),
    ),
    sansFont,
  };
}

export function chartColorVar(index: number) {
  return CHART_COLOR_VARS[index % CHART_COLOR_VARS.length]!;
}

export function resolveCssColor(color: string, fallback: string) {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.position = "absolute";
  probe.style.pointerEvents = "none";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);

  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved || fallback;
}
