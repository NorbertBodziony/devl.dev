import { GroupedBarChart } from "@orbit/ui/charts/grouped-bar";

const SERIES = [
  { key: "y2024", name: "2024", color: "var(--muted-foreground)" },
  { key: "y2025", name: "2025" },
  { key: "y2026", name: "2026" },
];

const DATA = [
  { quarter: "Q1", y2024: 124, y2025: 186, y2026: 254 },
  { quarter: "Q2", y2024: 142, y2025: 218, y2026: 312 },
  { quarter: "Q3", y2024: 168, y2025: 244, y2026: 378 },
  { quarter: "Q4", y2024: 191, y2025: 281, y2026: null },
];

export function ChartsBarGroupedShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-5xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Quarterly bookings · ARR (k)
        </div>
        <h1 class="mt-1 font-heading text-2xl">Year-over-year</h1>

        <GroupedBarChart
          class="mt-6"
          data={DATA}
          labelKey="quarter"
          note="vs prev year · +44%"
          series={SERIES}
        />
      </div>
    </div>
  );
}
