import {
  CheckCircle2Icon,
  CircleAlertIcon,
  GitBranchIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-solid";
import { Avatar, AvatarFallback } from "@orbit/ui/avatar";

type Status = "succeeded" | "failed" | "rolled-back" | "in-progress";

interface Deploy {
  id: string;
  env: "production" | "staging" | "preview";
  branch: string;
  sha: string;
  status: Status;
  message: string;
  by: string;
  initials: string;
  duration: string;
  when: string;
}

const ENV_TONE: Record<Deploy["env"], string> = {
  production: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  staging: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  preview: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
};

const DEPLOYS: Deploy[] = [
  { id: "dpl_8a92", env: "production", branch: "main", sha: "f3b9a21", status: "in-progress", message: "feat(audit): persist 1y retention", by: "Maya Okafor", initials: "MO", duration: "06:42", when: "now" },
  { id: "dpl_4f01", env: "production", branch: "main", sha: "2b10f7c", status: "succeeded", message: "release v3.4", by: "Sean Brydon", initials: "SB", duration: "5m 18s", when: "1d" },
  { id: "dpl_31bc", env: "staging", branch: "main", sha: "4d99a0c", status: "succeeded", message: "chore: bump @orbit/ui", by: "Riya Patel", initials: "RP", duration: "1m 32s", when: "1d" },
  { id: "dpl_22ae", env: "preview", branch: "feat/audit-log", sha: "12cae71", status: "succeeded", message: "Merge feat/audit-log", by: "Maya Okafor", initials: "MO", duration: "2m 04s", when: "2d" },
  { id: "dpl_19fc", env: "production", branch: "main", sha: "9b0c44e", status: "rolled-back", message: "fix(billing): retry on 5xx", by: "James Lin", initials: "JL", duration: "4m 22s", when: "3d" },
  { id: "dpl_0ff3", env: "preview", branch: "fix/csv-export", sha: "7f10b5e", status: "failed", message: "wip(table): wire export action menu", by: "James Lin", initials: "JL", duration: "0m 48s", when: "4d" },
  { id: "dpl_0a91", env: "staging", branch: "main", sha: "8a204d3", status: "succeeded", message: "fix(table): respect filter in CSV export", by: "James Lin", initials: "JL", duration: "1m 41s", when: "5d" },
];

export function TimelinesDeploysShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-4xl">
        <div class="flex items-end justify-between">
          <div>
            <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
              acme/web · last 7 days
            </div>
            <h1 class="mt-1 font-heading text-2xl">Deploy history</h1>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-md border border-border/60 bg-background/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
            >
              All envs
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 font-mono text-[10px] text-background uppercase tracking-[0.25em]"
            >
              <RefreshCwIcon class="size-3" />
              Refresh
            </button>
          </div>
        </div>

        <div class="mt-6 overflow-hidden rounded-xl border border-border/60 bg-background/40">
          <ul class="divide-y divide-border/40">
            {DEPLOYS.map((d) => (
              <li

                class="grid grid-cols-[24px_120px_1fr_180px_auto] items-center gap-4 px-5 py-3.5"
              >
                <StatusGlyph status={d.status} />
                <div>
                  <span
                    class={
                      "rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] " +
                      ENV_TONE[d.env]
                    }
                  >
                    {d.env}
                  </span>
                </div>
                <div class="min-w-0">
                  <div class="truncate text-sm">{d.message}</div>
                  <div class="mt-1 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <GitBranchIcon class="size-3" />
                    {d.branch}
                    <span>·</span>
                    <span>{d.sha}</span>
                    <span>·</span>
                    <span>{d.duration}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Avatar class="size-5">
                    <AvatarFallback class="text-[9px]">
                      {d.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span class="truncate text-xs">{d.by}</span>
                  <span class="ml-auto font-mono text-[10px] text-muted-foreground">
                    {d.when} ago
                  </span>
                </div>
                {d.env === "production" && d.status === "succeeded" ? (
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcwIcon class="size-3" />
                    Roll back
                  </button>
                ) : (
                  <span class="font-mono text-[10px] text-muted-foreground">
                    {d.id}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusGlyph({ status }: { status: Status }) {
  if (status === "succeeded")
    return <CheckCircle2Icon class="size-5 text-emerald-500" />;
  if (status === "failed")
    return <XCircleIcon class="size-5 text-rose-500" />;
  if (status === "rolled-back")
    return <CircleAlertIcon class="size-5 text-amber-500" />;
  return (
    <span class="grid size-5 place-items-center">
      <span class="absolute size-3 animate-ping rounded-full bg-foreground/30" />
      <span class="size-2 rounded-full bg-foreground" />
    </span>
  );
}
