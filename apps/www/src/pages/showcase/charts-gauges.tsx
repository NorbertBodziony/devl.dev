import { GaugeGrid } from "@orbit/ui/charts/gauge-grid";

const GAUGES = [
  {
    name: "API uptime",
    value: 99.94,
    target: "99.9%",
    unit: "%",
    detail: "30-day rolling · 13 incidents",
    percent: 0.9994,
    status: "on-track",
  },
  {
    name: "P95 latency",
    value: 248,
    target: "300ms",
    unit: "ms",
    detail: "All regions · /v3 endpoints",
    percent: 248 / 600,
    status: "on-track",
  },
  {
    name: "Error budget",
    value: 64,
    target: "100%",
    unit: "%",
    detail: "Burned 36% this quarter",
    percent: 0.64,
    status: "on-track",
  },
] as const;

export function ChartsGaugesShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-5xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Service-level objectives · Q2
        </div>
        <h1 class="mt-1 font-heading text-2xl">SLO health</h1>

        <GaugeGrid class="mt-6" gauges={GAUGES} />
      </div>
    </div>
  );
}
