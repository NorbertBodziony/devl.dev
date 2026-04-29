import { RevenueAreaChart } from "@orbit/ui/charts/revenue-area";
import { Eyebrow, Heading } from "@orbit/ui/typography";

const SERIES = [
  { key: "subs", name: "Subscriptions" },
  { key: "addons", name: "Add-ons" },
  { key: "services", name: "Services" },
];

const MONTHS = [
  "May", "Jun", "Jul", "Aug", "Sep", "Oct",
  "Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
];

const SUBS = [22, 26, 28, 31, 34, 38, 42, 47, 49, 52, 56, 62];
const ADDONS = [6, 8, 9, 11, 13, 14, 14, 15, 17, 19, 22, 24];
const SERVICES = [3, 4, 5, 5, 7, 8, 9, 10, 12, 11, 13, 14];

const DATA = MONTHS.map((m, i) => ({
  month: m,
  subs: SUBS[i],
  addons: ADDONS[i],
  services: SERVICES[i],
  total: SUBS[i]! + ADDONS[i]! + SERVICES[i]!,
}));

export function ChartsRevenueAreaShowcasePage() {
  const total = DATA[DATA.length - 1]!.total;

  return (
    <div class="min-h-svh bg-background px-4 py-10 sm:px-10">
      <div class="mx-auto max-w-5xl">
        <Eyebrow>
          Revenue · last 12 months
        </Eyebrow>
        <Heading as="h1" size="lg" class="mt-1 tracking-normal">Net revenue</Heading>

        <RevenueAreaChart
          badge="+18.4% vs prev. 12mo"
          class="mt-6"
          data={DATA}
          labelKey="month"
          metric={`$${total}.4k`}
          series={SERIES}
        />
      </div>
    </div>
  );
}
