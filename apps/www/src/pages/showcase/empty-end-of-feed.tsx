import { CheckIcon, RotateCwIcon } from "lucide-solid";
import { Button } from "@orbit/ui/button";

const FEED = [
  { id: 1, who: "Lina", what: "shipped pricing-v2 to production", when: "12m" },
  { id: 2, who: "Marc", what: "merged #2914 into main", when: "47m" },
  { id: 3, who: "Priya", what: "opened a PR for billing webhooks", when: "2h" },
];

export function EmptyEndOfFeedShowcasePage() {
  return (
    <div class="min-h-svh bg-background">
      <div class="mx-auto max-w-2xl px-6 py-12">
        <div class="mb-6 flex items-center justify-between">
          <h1 class="font-heading text-xl">Activity</h1>
          <span class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            Today · 3 events
          </span>
        </div>

        <ol class="flex flex-col gap-3">
          {FEED.map((event) => (
            <li

              class="rounded-lg border border-border/70 bg-background px-4 py-3 text-sm"
            >
              <span class="font-medium">{event.who}</span>{" "}
              <span class="text-muted-foreground">{event.what}</span>
              <span class="ml-2 font-mono text-[11px] text-muted-foreground/80">
                {event.when}
              </span>
            </li>
          ))}
        </ol>

        <EndMarker />
      </div>
    </div>
  );
}

function EndMarker() {
  return (
    <div class="mt-8 flex flex-col items-center gap-3">
      <div class="flex w-full items-center gap-3">
        <div class="h-px flex-1 bg-border/70" />
        <div class="flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
          <CheckIcon class="size-3" />
        </div>
        <div class="h-px flex-1 bg-border/70" />
      </div>
      <p class="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.25em]">
        End of feed
      </p>
      <p class="max-w-xs text-balance text-center text-muted-foreground text-xs">
        You've seen everything from the last 24 hours. New events will appear
        at the top.
      </p>
      <Button variant="ghost" size="sm" class="mt-1">
        <RotateCwIcon />
        Refresh
      </Button>
    </div>
  );
}
