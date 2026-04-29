import { MultiLineChart } from "@orbit/ui/charts/multi-line";

const SERIES = [
  { key: "web", name: "Web" },
  { key: "ios", name: "iOS" },
  { key: "android", name: "Android" },
];

const WEB = [120, 142, 138, 152, 168, 174, 198, 210, 195, 218, 232, 248, 264, 252, 280, 296, 314, 322, 308, 332, 348, 358, 372, 388, 402, 414, 428, 446, 458, 472];
const IOS = [62, 70, 68, 78, 88, 92, 96, 102, 110, 116, 124, 130, 138, 144, 152, 158, 164, 170, 178, 186, 194, 202, 210, 218, 224, 232, 240, 248, 256, 262];
const ANDROID = [42, 44, 50, 52, 58, 60, 64, 66, 72, 74, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 122, 126, 130, 134, 138, 142, 146, 150, 154, 158];

const DATA = WEB.map((_, i) => ({
  day: `Apr ${i + 1}`,
  web: WEB[i],
  ios: IOS[i],
  android: ANDROID[i],
}));

export function ChartsLineMultiShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-5xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Daily active users · Apr 2026
        </div>
        <h1 class="mt-1 font-heading text-2xl">DAU by platform</h1>

        <MultiLineChart
          class="mt-6"
          data={DATA}
          labelKey="day"
          rangeLabel="30d"
          ranges={["7d", "30d", "90d"]}
          series={SERIES}
        />
      </div>
    </div>
  );
}
