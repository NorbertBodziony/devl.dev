import { GaugeGrid } from "@orbit/ui/charts/gauge-grid";
import { Eyebrow, Heading } from "@orbit/ui/typography";

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
    <div class="min-h-svh bg-background px-4 py-10 sm:px-10">
      <div class="mx-auto max-w-5xl">
        <Eyebrow>
          Service-level objectives · Q2
        </Eyebrow>
        <Heading as="h1" size="lg" class="mt-1 tracking-normal">SLO health</Heading>

        <GaugeGrid class="mt-6" gauges={GAUGES} />
      </div>
    </div>
  );
}
