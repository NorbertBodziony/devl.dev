import { WaterfallChart } from "@orbit/ui/charts/waterfall";

const STEPS = [
  { label: "Q4 ARR", value: 1640, type: "start" },
  { label: "New", value: 412, type: "delta" },
  { label: "Expansion", value: 184, type: "delta" },
  { label: "Reactivation", value: 38, type: "delta" },
  { label: "Contraction", value: -94, type: "delta" },
  { label: "Churn", value: -126, type: "delta" },
  { label: "Q1 ARR", value: 2054, type: "end" },
] as const;

export function ChartsWaterfallShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-5xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          ARR movement · Q4 → Q1 (k)
        </div>
        <h1 class="mt-1 font-heading text-2xl">Net retention waterfall</h1>

        <WaterfallChart class="mt-6" nrrLabel="NRR 125.2%" steps={STEPS} yMax={2300} />
      </div>
    </div>
  );
}
