// @ts-nocheck
import {
  MoreHorizontalIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-solid";
import { Button } from "@orbit/ui/button";
import { MetricTile } from "@orbit/ui/metric-tile";

const STATS = [
  { label: "Active users", value: "12,408", delta: "+8.2%", trend: "up" as const, sub: "vs. last 30d" },
  { label: "MRR", value: "$48.6k", delta: "+12.4%", trend: "up" as const, sub: "vs. last 30d" },
  { label: "Churn", value: "1.8%", delta: "-0.3%", trend: "up" as const, sub: "vs. last 30d" },
  { label: "Avg. session", value: "6m 22s", delta: "-1.1%", trend: "down" as const, sub: "vs. last 30d" },
];

const SPARK = [12, 18, 14, 22, 19, 28, 24, 33, 29, 38, 34, 42];

const ACTIVITY = [
  { who: "Maya Okafor", what: "deployed", target: "main → production", time: "2m" },
  { who: "James Lin", what: "created", target: "PR #128 — audit log", time: "8m" },
  { who: "Riya Patel", what: "invited", target: "5 new members", time: "21m" },
  { who: "Dani Kim", what: "archived", target: "marketing-v1 project", time: "1h" },
  { who: "Alex Tran", what: "rolled back", target: "release 0.4.1", time: "2h" },
];

export function DashboardsMetricsOverviewShowcasePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="border-b border-border/60 px-10 py-6">
        <div className="mx-auto flex max-w-6xl items-end justify-between">
          <div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
              Workspace · Acme inc.
            </div>
            <h1 className="mt-1 font-heading text-2xl">Overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePill />
            <Button size="sm" type="button">
              <PlusIcon />
              New report
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-10 py-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <MetricTile
              key={s.label}
              label={s.label}
              value={s.value}
              delta={s.delta}
              trend={s.trend}
              tone={s.trend === "up" ? "positive" : "danger"}
              sub={s.sub}
              variant="stat"
              trailing={
                <button
                  type="button"
                  className="text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  <MoreHorizontalIcon className="size-4" />
                </button>
              }
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <ChartCard />
          <ActivityCard />
        </div>
      </main>
    </div>
  );
}

function ChartCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border/60 bg-background/40 p-5 lg:col-span-2">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
            Active users · daily
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-2xl">12,408</span>
            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              <TrendingUpIcon className="size-3" />
              +8.2%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
          <button
            type="button"
            className="rounded px-2 py-1 transition-colors hover:bg-foreground/[0.05]"
          >
            7d
          </button>
          <button
            type="button"
            className="rounded bg-foreground/[0.08] px-2 py-1 text-foreground"
          >
            30d
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 transition-colors hover:bg-foreground/[0.05]"
          >
            90d
          </button>
        </div>
      </div>

      <div className="mt-6 min-h-52 w-full flex-1">
        <Sparkline data={SPARK} />
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const W = 600;
  const H = 160;
  const PAD_X = 8;
  const PAD_TOP = 12;
  const PAD_BOTTOM = 18;
  const max = Math.max(...data);
  const rangeMax = max * 1.16 || 1;
  const chartHeight = H - PAD_TOP - PAD_BOTTOM;
  const stepX = (W - PAD_X * 2) / (data.length - 1);
  const coords = data.map((v, i) => {
    const x = PAD_X + i * stepX;
    const y = PAD_TOP + (1 - v / rangeMax) * chartHeight;
    return { x, y };
  });
  const points = coords.map((p) => `${p.x},${p.y}`).join(" ");
  const floor = H - PAD_BOTTOM;
  const area = `M ${PAD_X} ${floor} L ${coords
    .map((p) => `${p.x} ${p.y}`)
    .join(" L ")} L ${W - PAD_X} ${floor} Z`;
  const grid = [0.25, 0.5, 0.75].map((ratio) => PAD_TOP + chartHeight * ratio);
  const last = coords[coords.length - 1];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-full w-full overflow-visible"
    >
      {grid.map((y) => (
        <line
          x1={PAD_X}
          x2={W - PAD_X}
          y1={y}
          y2={y}
          stroke="var(--border)"
          strokeDasharray="2 6"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="var(--chart-2)" opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {last ? (
        <g>
          <circle cx={last.x} cy={last.y} r="7" fill="var(--chart-2)" opacity="0.14" />
          <circle cx={last.x} cy={last.y} r="3" fill="var(--chart-2)" />
        </g>
      ) : null}
    </svg>
  );
}

function ActivityCard() {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
          Recent activity
        </div>
        <button
          type="button"
          className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em] transition-colors hover:text-foreground"
        >
          See all
        </button>
      </div>
      <ul className="mt-4 flex flex-col gap-3.5">
        {ACTIVITY.map((a, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] font-medium text-[10px]">
              {a.who.split(" ").map((n) => n[0]).join("")}
            </span>
            <div className="min-w-0 flex-1 leading-snug">
              <span className="font-medium">{a.who}</span>{" "}
              <span className="text-muted-foreground">{a.what}</span>{" "}
              <span className="text-foreground/85">{a.target}</span>
              <div className="mt-0.5 font-mono text-[10px] text-muted-foreground/70 uppercase tracking-[0.2em]">
                {a.time} ago
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DateRangePill() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Mar 27 – Apr 25
    </button>
  );
}
