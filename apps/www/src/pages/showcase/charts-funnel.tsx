import { FunnelChart } from "@orbit/ui/charts/funnel";

const STAGES = [
  { name: "Visited landing", count: 48214, kind: "Page view" },
  { name: "Started signup", count: 12480, kind: "Click" },
  { name: "Verified email", count: 9842, kind: "Confirmation" },
  { name: "Completed onboarding", count: 7321, kind: "Step 4" },
  { name: "Activated workspace", count: 4209, kind: "First action" },
  { name: "Invited a teammate", count: 1864, kind: "Conversion" },
];

const STATS = [
  { label: "Visit → signup", value: "25.9%", tone: "emerald" },
  { label: "Signup → activate", value: "33.7%", tone: "amber" },
  { label: "Activate → invite", value: "44.3%", tone: "emerald" },
] as const;

export function ChartsFunnelShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-3xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Onboarding funnel · last 30 days
        </div>
        <h1 class="mt-1 font-heading text-2xl">Activation</h1>
        <p class="mt-1 text-muted-foreground text-sm">
          End-to-end conversion: <span class="text-foreground">3.87%</span>{" "}
          of visitors activate.
        </p>

        <FunnelChart class="mt-8" stages={STAGES} stats={STATS} />
      </div>
    </div>
  );
}
