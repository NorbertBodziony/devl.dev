import { CohortHeatmap } from "@orbit/ui/charts/cohort-heatmap";

const COHORTS = [
  { label: "Apr 2025", size: 412 },
  { label: "May 2025", size: 538 },
  { label: "Jun 2025", size: 612 },
  { label: "Jul 2025", size: 489 },
  { label: "Aug 2025", size: 681 },
  { label: "Sep 2025", size: 822 },
  { label: "Oct 2025", size: 754 },
  { label: "Nov 2025", size: 901 },
  { label: "Dec 2025", size: 1024 },
  { label: "Jan 2026", size: 1180 },
  { label: "Feb 2026", size: 994 },
  { label: "Mar 2026", size: 1342 },
];

const MONTHS = 12;
const ROWS = COHORTS.map((cohort, cohortIndex) => {
  const available = MONTHS - cohortIndex;
  return {
    ...cohort,
    values: Array.from({ length: MONTHS }).map((_, monthIndex) => {
      if (monthIndex >= available) return null;

      const value = decay(monthIndex);
      const variance = ((cohortIndex * 7 + monthIndex * 3) % 9) - 4;
      return value === null
        ? null
        : Math.max(0, Math.min(100, value + variance));
    }),
  };
});

export function ChartsCohortHeatmapShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-5xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Retention · weekly product use
        </div>
        <h1 class="mt-1 font-heading text-2xl">Cohort retention</h1>
        <p class="mt-1 max-w-prose text-muted-foreground text-sm">
          Percent of users from each signup month who returned in subsequent
          months.
        </p>

        <CohortHeatmap
          averageLabel="Average M3: 64.2%"
          class="mt-6"
          rows={ROWS}
        />
      </div>
    </div>
  );
}

function decay(month: number) {
  const base = [100, 84, 72, 64, 58, 53, 50, 47, 44, 42, 40, 38];
  return base[month] ?? null;
}
