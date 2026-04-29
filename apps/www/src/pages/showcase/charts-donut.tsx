import { DonutChart } from "@orbit/ui/charts/donut";

const SLICES = [
  { name: "Subscriptions", value: 64.4 },
  { name: "Add-ons", value: 18.2 },
  { name: "Services", value: 9.8 },
  { name: "Marketplace", value: 4.6 },
  { name: "Other", value: 3.0 },
];

export function ChartsDonutShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-5xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Revenue mix · Q1 2026
        </div>
        <h1 class="mt-1 font-heading text-2xl">Where revenue comes from</h1>

        <DonutChart
          class="mt-6"
          revenueMultiplier={18400}
          slices={SLICES}
          totalValue="$1.84M"
          trendLabel="+14.2% vs Q4"
        />
      </div>
    </div>
  );
}
