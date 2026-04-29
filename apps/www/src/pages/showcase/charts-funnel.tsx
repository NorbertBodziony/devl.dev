import { FunnelChart } from "@orbit/ui/charts/funnel";
import { Eyebrow, Heading } from "@orbit/ui/typography";

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
    <div class="min-h-svh bg-background px-4 py-10 sm:px-10">
      <div class="mx-auto max-w-3xl">
        <Eyebrow>
          Onboarding funnel · last 30 days
        </Eyebrow>
        <Heading as="h1" size="lg" class="mt-1 tracking-normal">Activation</Heading>
        <p class="mt-1 text-muted-foreground text-sm">
          End-to-end conversion: <span class="text-foreground">3.87%</span>{" "}
          of visitors activate.
        </p>

        <FunnelChart class="mt-8" stages={STAGES} stats={STATS} />
      </div>
    </div>
  );
}
