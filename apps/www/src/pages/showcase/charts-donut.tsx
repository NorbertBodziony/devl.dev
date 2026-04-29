import { DonutChart } from "@orbit/ui/charts/donut";
import { Eyebrow, Heading } from "@orbit/ui/typography";

const SLICES = [
  { name: "Subscriptions", value: 64.4 },
  { name: "Add-ons", value: 18.2 },
  { name: "Services", value: 9.8 },
  { name: "Marketplace", value: 4.6 },
  { name: "Other", value: 3.0 },
];

export function ChartsDonutShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-4 py-10 sm:px-10">
      <div class="mx-auto max-w-5xl">
        <Eyebrow>
          Revenue mix · Q1 2026
        </Eyebrow>
        <Heading as="h1" size="lg" class="mt-1 tracking-normal">Where revenue comes from</Heading>

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
