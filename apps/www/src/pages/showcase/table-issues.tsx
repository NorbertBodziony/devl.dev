// @ts-nocheck
import { createEffect, createSignal, onCleanup } from "solid-js";
import {
  CheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusCircleIcon,
  SearchIcon,
  TagIcon,
  UserIcon,
} from "lucide-solid";
import { Avatar, AvatarFallback } from "@orbit/ui/avatar";
import { Badge } from "@orbit/ui/badge";
import { Button } from "@orbit/ui/button";
import { Checkbox } from "@orbit/ui/checkbox";
import { CheckboxGroup } from "@orbit/ui/checkbox-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@orbit/ui/input-group";
import { Label } from "@orbit/ui/label";
import { Separator } from "@orbit/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@orbit/ui/table";

type Status = "todo" | "in-progress" | "in-review" | "done";
type Priority = "p0" | "p1" | "p2" | "p3" | "none";

interface Issue {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: { initials: string; tone: string } | null;
  labels: string[];
  updated: string;
  estimate?: number;
}

const STATUS_META: Record<Status, { label: string; icon: typeof CheckIcon; cls: string }> = {
  todo: { label: "Todo", icon: CircleIcon, cls: "text-muted-foreground" },
  "in-progress": { label: "In Progress", icon: CircleDotIcon, cls: "text-amber-500" },
  "in-review": { label: "In Review", icon: CircleDashedIcon, cls: "text-violet-500" },
  done: { label: "Done", icon: CheckIcon, cls: "text-emerald-500" },
};

const PRIORITY_META: Record<Priority, { label: string; cls: string }> = {
  p0: { label: "Urgent", cls: "border-destructive/30 text-destructive" },
  p1: { label: "High", cls: "border-amber-500/30 text-amber-700 dark:text-amber-400" },
  p2: { label: "Med", cls: "border-sky-500/30 text-sky-700 dark:text-sky-400" },
  p3: { label: "Low", cls: "border-border text-muted-foreground" },
  none: { label: "—", cls: "border-dashed text-muted-foreground" },
};

const LABEL_TONE: Record<string, string> = {
  bug: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
  feature: "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-400",
  infra: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  docs: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-400",
  design: "bg-pink-500/10 text-pink-700 border-pink-500/20 dark:text-pink-400",
  perf: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
};

const ISSUES: Issue[] = [
  { id: "ENG-218", title: "Realtime cursors flicker on Safari 17 after WS reconnect", status: "in-progress", priority: "p0", assignee: { initials: "AL", tone: "bg-rose-500/15" }, labels: ["bug", "perf"], updated: "12m", estimate: 5 },
  { id: "ENG-217", title: "Add cycle progress chart to project sidebar", status: "in-review", priority: "p2", assignee: { initials: "GH", tone: "bg-amber-500/15" }, labels: ["feature", "design"], updated: "2h", estimate: 3 },
  { id: "ENG-216", title: "Migrate billing webhook to v2 schema", status: "todo", priority: "p1", assignee: { initials: "AT", tone: "bg-sky-500/15" }, labels: ["infra"], updated: "Yesterday", estimate: 8 },
  { id: "ENG-215", title: "Filter chips: persist operator across pages", status: "todo", priority: "p3", assignee: null, labels: ["bug"], updated: "Apr 22", estimate: 2 },
  { id: "ENG-214", title: "Document new `useFilters()` hook + ergonomics", status: "in-progress", priority: "p2", assignee: { initials: "LT", tone: "bg-emerald-500/15" }, labels: ["docs"], updated: "Apr 22" },
  { id: "ENG-213", title: "Reduce p99 latency on `/v1/search` ≤ 180ms", status: "in-review", priority: "p1", assignee: { initials: "MH", tone: "bg-violet-500/15" }, labels: ["perf", "infra"], updated: "Apr 21", estimate: 13 },
  { id: "ENG-212", title: "Onboarding: reorder workspace steps", status: "done", priority: "p3", assignee: { initials: "ED", tone: "bg-indigo-500/15" }, labels: ["design"], updated: "Apr 19", estimate: 3 },
];

export function TableIssuesShowcasePage() {
  const [openFacet, setOpenFacet] = createSignal<string | null>(null);

  createEffect(() => {
    if (!openFacet() || typeof document === "undefined") return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-facet-popover-root]")) return;
      setOpenFacet(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    onCleanup(() => document.removeEventListener("pointerdown", onPointerDown));
  });

  return (
    <div className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl">Issues</h1>
            <p className="text-muted-foreground text-sm">
              ENG · Cycle 14 · 7 visible of 218
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">Group: None</Button>
            <Button size="sm">+ New issue</Button>
          </div>
        </header>

        <div className="rounded-xl border bg-card shadow-xs/5">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 border-b p-3">
            <InputGroup className="w-64">
              <InputGroupAddon>
                <SearchIcon className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search issues…" />
            </InputGroup>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <FacetButton
              id="status"
              label="Status"
              count={2}
              chips={["Todo", "In Progress"]}
              openFacet={openFacet()}
              setOpenFacet={setOpenFacet}
            >
              <FacetSearch />
              <Separator />
              <CheckboxGroup
                aria-label="Status"
                defaultValue={["todo", "in-progress"]}
                className="flex flex-col p-1"
              >
                {(Object.keys(STATUS_META) as Status[]).map((s) => {
                  const m = STATUS_META[s];
                  const Icon = m.icon;
                  return (
                    <Label
                      key={s}
                      className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    >
                      <Checkbox value={s} />
                      <Icon className={"size-3.5 " + m.cls} />
                      <span className="flex-1">{m.label}</span>
                    </Label>
                  );
                })}
              </CheckboxGroup>
            </FacetButton>

            <FacetButton
              id="priority"
              label="Priority"
              count={1}
              chips={["High"]}
              openFacet={openFacet()}
              setOpenFacet={setOpenFacet}
            >
              <CheckboxGroup
                aria-label="Priority"
                defaultValue={["p1"]}
                className="flex flex-col p-1"
              >
                {(["p0", "p1", "p2", "p3"] as Priority[]).map((p) => (
                  <Label
                    key={p}
                    className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Checkbox value={p} />
                    <Badge variant="outline" size="sm" className={"font-mono text-[10px] " + PRIORITY_META[p].cls}>
                      {PRIORITY_META[p].label}
                    </Badge>
                  </Label>
                ))}
              </CheckboxGroup>
            </FacetButton>

            <FacetButton
              id="assignee"
              label="Assignee"
              icon={<UserIcon className="size-3.5" />}
              openFacet={openFacet()}
              setOpenFacet={setOpenFacet}
            >
              <FacetSearch />
              <Separator />
              <CheckboxGroup aria-label="Assignee" className="flex flex-col p-1">
                {[
                  { v: "ada", l: "Ada Lovelace", i: "AL" },
                  { v: "grace", l: "Grace Hopper", i: "GH" },
                  { v: "alan", l: "Alan Turing", i: "AT" },
                  { v: "linus", l: "Linus Torvalds", i: "LT" },
                ].map((a) => (
                  <Label
                    key={a.v}
                    className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Checkbox value={a.v} />
                    <Avatar className="size-5">
                      <AvatarFallback className="bg-muted font-medium text-[9px]">
                        {a.i}
                      </AvatarFallback>
                    </Avatar>
                    {a.l}
                  </Label>
                ))}
              </CheckboxGroup>
            </FacetButton>

            <FacetButton
              id="label"
              label="Label"
              icon={<TagIcon className="size-3.5" />}
              openFacet={openFacet()}
              setOpenFacet={setOpenFacet}
            >
              <CheckboxGroup aria-label="Label" className="flex flex-col p-1">
                {Object.keys(LABEL_TONE).map((label) => (
                  <Label
                    key={label}
                    className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Checkbox value={label} />
                    <Badge variant="outline" size="sm" className={"text-[10px] " + LABEL_TONE[label]}>
                      {label}
                    </Badge>
                  </Label>
                ))}
              </CheckboxGroup>
            </FacetButton>

            <Button size="sm" variant="ghost" className="border-dashed">
              <PlusCircleIcon />
              <span className="text-muted-foreground">Add filter</span>
            </Button>

            <span className="ms-auto text-muted-foreground text-xs">
              <span className="text-foreground">3 filters</span> active
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="ps-4 w-px">
                  <Checkbox aria-label="Select all" />
                </TableHead>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Priority</TableHead>
                <TableHead className="w-24">Estimate</TableHead>
                <TableHead className="w-24">Assignee</TableHead>
                <TableHead className="pe-4 w-28 text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ISSUES.map((issue) => {
                const m = STATUS_META[issue.status];
                const Icon = m.icon;
                return (
                  <TableRow key={issue.id}>
                    <TableCell className="ps-4">
                      <Checkbox aria-label={`Select ${issue.id}`} />
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2 font-mono text-muted-foreground text-xs">
                        <Icon className={"size-3.5 " + m.cls} />
                        {issue.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{issue.title}</span>
                        {issue.labels.map((lbl) => (
                          <Badge
                            key={lbl}
                            variant="outline"
                            size="sm"
                            className={"shrink-0 text-[10px] " + (LABEL_TONE[lbl] ?? "")}
                          >
                            {lbl}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        size="sm"
                        className={"font-mono text-[10px] " + PRIORITY_META[issue.priority].cls}
                      >
                        {PRIORITY_META[issue.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {issue.estimate ? (
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] tabular-nums">
                          {issue.estimate}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {issue.assignee ? (
                        <Avatar className={"size-6 " + issue.assignee.tone}>
                          <AvatarFallback className="bg-transparent font-medium text-[10px]">
                            {issue.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div
                          className="size-6 rounded-full border border-dashed"
                          aria-label="Unassigned"
                        />
                      )}
                    </TableCell>
                    <TableCell className="pe-4 text-right text-muted-foreground text-xs tabular-nums">
                      {issue.updated}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function FacetButton(props: {
  id: string;
  label: string;
  icon?: any;
  count?: number;
  chips?: string[];
  children: any;
  openFacet: string | null;
  setOpenFacet: (id: string | null) => void;
}) {
  const open = () => props.openFacet === props.id;

  return (
    <div className="relative" data-facet-popover-root="">
      <Button
        size="sm"
        variant="outline"
        onClick={() => props.setOpenFacet(open() ? null : props.id)}
        className={
          props.count
            ? "items-center border-foreground/20 bg-foreground/5 leading-none [&_[data-slot=badge]]:translate-y-0 [&_[data-slot=badge]]:leading-none [&_[role=separator]]:self-center"
            : "items-center border-dashed leading-none"
        }
      >
        {props.icon ?? <PlusCircleIcon />}
        <span className="inline-flex items-center leading-none">{props.label}</span>
        {props.count ? (
          <>
            <Separator orientation="vertical" className="mx-1 h-3" />
            {props.chips && props.chips.length <= 2 ? (
              props.chips.map((chip) => (
                <Badge
                  key={chip}
                  variant="secondary"
                  size="sm"
                  className="font-mono text-[10px] leading-none"
                >
                  {chip}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" size="sm" className="font-mono text-[10px] leading-none">
                {props.count}
              </Badge>
            )}
          </>
        ) : null}
      </Button>
      {open() ? (
        <div
          className="absolute left-0 top-[calc(100%+0.25rem)] z-50 flex w-60 rounded-lg border bg-popover p-0 text-popover-foreground shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
          data-slot="popover-popup"
        >
          <div className="relative size-full max-h-(--available-height) overflow-clip px-(--viewport-inline-padding) py-4 [--viewport-inline-padding:--spacing(4)] not-data-transitioning:overflow-y-auto">
            {props.children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FacetSearch() {
  return (
    <div className="p-2">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon className="size-3.5 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Filter…" className="h-8 text-sm" />
      </InputGroup>
    </div>
  );
}
