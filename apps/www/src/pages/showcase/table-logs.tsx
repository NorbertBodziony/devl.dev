// @ts-nocheck
import { createMemo } from "solid-js";
import { createSignal } from "solid-js";
import { CircleAlertIcon, ExternalLinkIcon, FlameIcon, InfoIcon, MailIcon, PauseIcon, PlayIcon, PlayIcon as RetryIcon, TerminalIcon, } from "lucide-solid";
import { Badge } from "@orbit/ui/badge";
import { Button } from "@orbit/ui/button";
import { CodeBlock } from "@orbit/ui/code-block";
import { InfoSection } from "@orbit/ui/info-section";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@orbit/ui/input-group";
import { KeyValueRow } from "@orbit/ui/key-value-row";
import { Kbd } from "@orbit/ui/kbd";
import { Separator } from "@orbit/ui/separator";
import { Sheet, SheetHeader, SheetPanel, SheetPopup, SheetTitle, } from "@orbit/ui/sheet";
import { StatusIndicator, type StatusTone } from "@orbit/ui/status-indicator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@orbit/ui/table";
type Severity = "debug" | "info" | "warn" | "error";
interface Entry {
    id: string;
    ts: string;
    iso: string;
    severity: Severity;
    service: string;
    serviceVersion: string;
    request: string;
    traceId: string;
    message: string;
    status?: number;
    duration?: number;
    region: string;
    context: {
        label: string;
        value: string;
    }[];
    payload?: {
        kind: "json" | "text";
        body: string;
    };
    timing?: {
        label: string;
        ms: number;
        share: number;
    }[];
    stack?: string[];
}
const SEVERITY_STYLES: Record<Severity, {
    tone: StatusTone;
}> = {
    debug: { tone: "muted" },
    info: { tone: "info" },
    warn: { tone: "warning" },
    error: { tone: "danger" },
};
const ENTRIES: Entry[] = [
    {
        id: "e_1",
        ts: "12:48:21.094",
        iso: "2026-04-26T12:48:21.094Z",
        severity: "info",
        service: "api",
        serviceVersion: "v0.5.2",
        request: "req_8x12",
        traceId: "tr_a91f3c8b6e5d04a1",
        region: "eu-west-1",
        message: "GET /v1/projects 200",
        status: 200,
        duration: 24,
        context: [
            { label: "method", value: "GET" },
            { label: "path", value: "/v1/projects" },
            { label: "workspace_id", value: "ws_acme" },
            { label: "actor", value: "user_sean" },
            { label: "ip", value: "203.0.113.42" },
        ],
        timing: [
            { label: "queue", ms: 1, share: 4 },
            { label: "auth", ms: 3, share: 13 },
            { label: "db", ms: 14, share: 58 },
            { label: "serialize", ms: 6, share: 25 },
        ],
        payload: {
            kind: "json",
            body: '{\n  "items": [\n    { "id": "p_q3", "name": "Q3 planning" },\n    { "id": "p_obd", "name": "Onboarding redesign" },\n    { "id": "p_mkt", "name": "Marketing site" }\n  ],\n  "next_cursor": null\n}',
        },
    },
    {
        id: "e_2",
        ts: "12:48:21.221",
        iso: "2026-04-26T12:48:21.221Z",
        severity: "info",
        service: "api",
        serviceVersion: "v0.5.2",
        request: "req_8x13",
        traceId: "tr_b8e2d4f0c11a94e0",
        region: "eu-west-1",
        message: "GET /v1/projects/atlas/members 200",
        status: 200,
        duration: 41,
        context: [
            { label: "method", value: "GET" },
            { label: "path", value: "/v1/projects/atlas/members" },
            { label: "workspace_id", value: "ws_acme" },
            { label: "actor", value: "user_sean" },
        ],
        timing: [
            { label: "queue", ms: 2, share: 5 },
            { label: "auth", ms: 5, share: 12 },
            { label: "db", ms: 28, share: 68 },
            { label: "serialize", ms: 6, share: 15 },
        ],
    },
    {
        id: "e_3",
        ts: "12:48:21.840",
        iso: "2026-04-26T12:48:21.840Z",
        severity: "warn",
        service: "worker",
        serviceVersion: "v0.5.0",
        request: "job_4127",
        traceId: "tr_c33891e2f7a18f30",
        region: "eu-west-1",
        message: "queue 'mailer' depth=124 above threshold (100)",
        context: [
            { label: "queue", value: "mailer" },
            { label: "depth", value: "124" },
            { label: "threshold", value: "100" },
            { label: "consumers", value: "3" },
        ],
    },
    {
        id: "e_4",
        ts: "12:48:22.011",
        iso: "2026-04-26T12:48:22.011Z",
        severity: "debug",
        service: "scheduler",
        serviceVersion: "v0.4.9",
        request: "—",
        traceId: "tr_d4471e7c92b3fe1f",
        region: "eu-west-1",
        message: "tick 6f8e elapsed=2.1s next=2026-04-26T12:53Z",
        context: [
            { label: "tick_id", value: "6f8e" },
            { label: "elapsed", value: "2.1s" },
            { label: "next_run", value: "2026-04-26T12:53:00Z" },
        ],
    },
    {
        id: "e_5",
        ts: "12:48:22.318",
        iso: "2026-04-26T12:48:22.318Z",
        severity: "error",
        service: "billing",
        serviceVersion: "v0.5.2",
        request: "req_8x14",
        traceId: "tr_e8f7c1a3b06d3225",
        region: "eu-west-1",
        message: "stripe.charge.failed: card_declined card=•••4242",
        status: 402,
        duration: 612,
        context: [
            { label: "method", value: "POST" },
            { label: "path", value: "/v1/billing/charges" },
            { label: "workspace_id", value: "ws_acme" },
            { label: "stripe_charge_id", value: "ch_3PaT7L2eZvKYlo2C" },
            { label: "amount", value: "$240.00" },
            { label: "decline_code", value: "card_declined" },
        ],
        payload: {
            kind: "json",
            body: '{\n  "error": {\n    "type": "card_error",\n    "code": "card_declined",\n    "decline_code": "generic_decline",\n    "message": "Your card was declined.",\n    "param": "card"\n  }\n}',
        },
        stack: [
            "billing/stripe-billing-provider.ts:184  charge()",
            "billing/handle-charge-service.ts:62   processCharge()",
            "billing/projector.ts:38              onChargeRequested()",
            "kernel/event-bus.ts:91               dispatch()",
            "interfaces/http/billing-routes.ts:41  POST /v1/billing/charges",
        ],
    },
    {
        id: "e_6",
        ts: "12:48:22.519",
        iso: "2026-04-26T12:48:22.519Z",
        severity: "info",
        service: "api",
        serviceVersion: "v0.5.2",
        request: "req_8x15",
        traceId: "tr_f9d201ec458b2073",
        region: "eu-west-1",
        message: "POST /v1/sessions 201",
        status: 201,
        duration: 88,
        context: [
            { label: "method", value: "POST" },
            { label: "path", value: "/v1/sessions" },
            { label: "actor", value: "user_maya" },
        ],
        timing: [
            { label: "queue", ms: 3, share: 3 },
            { label: "auth", ms: 12, share: 14 },
            { label: "db", ms: 60, share: 68 },
            { label: "serialize", ms: 13, share: 15 },
        ],
    },
    {
        id: "e_7",
        ts: "12:48:22.804",
        iso: "2026-04-26T12:48:22.804Z",
        severity: "warn",
        service: "api",
        serviceVersion: "v0.5.2",
        request: "req_8x16",
        traceId: "tr_a012c87f4dab1fee",
        region: "eu-west-1",
        message: "deprecated query param 'team_id'",
        status: 200,
        duration: 31,
        context: [
            { label: "method", value: "GET" },
            { label: "path", value: "/v1/issues" },
            { label: "deprecated_param", value: "team_id" },
            { label: "use_instead", value: "team" },
            { label: "removal", value: "v0.6.0" },
        ],
    },
    {
        id: "e_8",
        ts: "12:48:23.022",
        iso: "2026-04-26T12:48:23.022Z",
        severity: "info",
        service: "worker",
        serviceVersion: "v0.5.0",
        request: "job_4128",
        traceId: "tr_b1d24e8870afc3c4",
        region: "eu-west-1",
        message: "processed 12 events in 410ms",
        context: [
            { label: "events", value: "12" },
            { label: "elapsed_ms", value: "410" },
            { label: "queue", value: "audit" },
        ],
    },
    {
        id: "e_9",
        ts: "12:48:23.540",
        iso: "2026-04-26T12:48:23.540Z",
        severity: "error",
        service: "ingest",
        serviceVersion: "v0.4.7",
        request: "req_8x17",
        traceId: "tr_c4ee2099a1fe305d",
        region: "eu-west-1",
        message: "schema validation: missing 'event.id'",
        status: 422,
        duration: 9,
        context: [
            { label: "method", value: "POST" },
            { label: "path", value: "/v1/ingest" },
            { label: "schema", value: "event/v3" },
            { label: "missing", value: "event.id" },
        ],
        payload: {
            kind: "json",
            body: '{\n  "type": "validation_error",\n  "errors": [\n    { "path": "event.id", "code": "required" }\n  ]\n}',
        },
        stack: [
            "ingest/validator.ts:127     validateEvent()",
            "ingest/handler.ts:52        receive()",
            "interfaces/http/ingest.ts:31 POST /v1/ingest",
        ],
    },
    {
        id: "e_10",
        ts: "12:48:23.999",
        iso: "2026-04-26T12:48:23.999Z",
        severity: "debug",
        service: "api",
        serviceVersion: "v0.5.2",
        request: "req_8x18",
        traceId: "tr_d18bf1095ec47a19",
        region: "eu-west-1",
        message: "cache hit projects/atlas (ttl 12s)",
        status: 200,
        duration: 4,
        context: [
            { label: "key", value: "projects:atlas" },
            { label: "ttl", value: "12s" },
            { label: "hit", value: "true" },
        ],
    },
];
export function TableLogsShowcasePage() {
    const [paused, setPaused] = createSignal(false);
    const [selectedId, setSelectedId] = createSignal<string | null>(null);
    const selected = createMemo(() => ENTRIES.find((e) => e.id === selectedId()) ?? null);
    return (<div className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TerminalIcon className="size-4 text-muted-foreground"/>
            <h1 className="font-heading text-xl">Logs</h1>
            <Badge variant="outline" className="ml-1 gap-1.5 font-mono text-[10px]">
              <StatusIndicator tone={paused() ? "muted" : "success"} dotClass={paused() ? "" : "animate-pulse"} />
              {paused() ? "paused" : "live"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <InputGroup className="w-72">
              <InputGroupAddon>
                <span className="font-mono text-muted-foreground text-xs">$</span>
              </InputGroupAddon>
              <InputGroupInput placeholder="severity:error service:billing" className="font-mono text-xs"/>
              <InputGroupAddon align="inline-end">
                <Kbd>⌘K</Kbd>
              </InputGroupAddon>
            </InputGroup>
            <Button size="sm" variant="outline" onClick={() => setPaused((p) => !p)}>
              {paused() ? <PlayIcon /> : <PauseIcon />}
              {paused() ? "Resume" : "Pause"}
            </Button>
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border bg-card font-mono shadow-xs/5">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="border-b bg-background">
                <TableHead className="ps-4 text-[10px] uppercase tracking-wider">Time</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider">Lvl</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider">Service</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider">Request</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider">Message</TableHead>
                <TableHead className="pe-4 text-right text-[10px] uppercase tracking-wider">ms</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ENTRIES.map((e) => {
            const s = SEVERITY_STYLES[e.severity];
            const active = selectedId() === e.id;
            return (<TableRow key={e.id} onClick={() => setSelectedId(e.id)} data-active={active} className={"cursor-pointer transition-colors " +
                    (active
                        ? "bg-foreground/[0.06]"
                        : e.severity === "error"
                            ? "bg-destructive/[0.04] hover:bg-destructive/[0.08]"
                            : "hover:bg-foreground/[0.03]")}>
                    <TableCell className="ps-4 text-muted-foreground tabular-nums">{e.ts}</TableCell>
                    <TableCell>
                      <StatusIndicator tone={s.tone} label={e.severity}/>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{e.service}</TableCell>
                    <TableCell className="text-muted-foreground">{e.request}</TableCell>
                    <TableCell className="max-w-md">
                      <span className="flex items-center gap-2">
                        {e.severity === "error" ? (<CircleAlertIcon className="size-3.5 shrink-0 text-destructive"/>) : e.severity === "warn" ? (<FlameIcon className="size-3.5 shrink-0 text-amber-500"/>) : e.severity === "info" ? (<InfoIcon className="size-3.5 shrink-0 text-sky-500/70"/>) : null}
                        <span className="truncate">{e.message}</span>
                        {e.status ? (<Badge variant="outline" size="sm" className={"ml-auto shrink-0 font-mono text-[9px] " +
                        (e.status >= 400
                            ? "border-destructive/30 text-destructive"
                            : "")}>
                            {e.status}
                          </Badge>) : null}
                      </span>
                    </TableCell>
                    <TableCell className="pe-4 text-right text-muted-foreground tabular-nums">
                      {e.duration ?? ""}
                    </TableCell>
                  </TableRow>);
        })}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">
          Showing last 10 entries · streaming from prod-eu-west-1 ·{" "}
          <span className="text-foreground/80">click a row for details</span>
        </p>
      </div>

      <LogDetailSheet entry={selected()} onClose={() => setSelectedId(null)}/>
    </div>);
}
function LogDetailSheet(props: {
    entry: Entry | null;
    onClose: () => void;
}) {
    return (<Sheet open={!!props.entry} onOpenChange={(o) => !o && props.onClose()}>
      <SheetPopup side="right" className="!max-w-xl">
        {props.entry ? (<>
              <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-mono text-base">
                <StatusIndicator tone={SEVERITY_STYLES[props.entry.severity].tone} label={props.entry.severity}/>
                <span className="text-foreground">{props.entry.request}</span>
                {props.entry.status ? (<Badge variant="outline" size="sm" className={"font-mono text-[9px] " +
                    (props.entry.status >= 400 ? "border-destructive/30 text-destructive" : "")}>
                    {props.entry.status}
                  </Badge>) : null}
              </SheetTitle>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {props.entry.iso} · {props.entry.service} {props.entry.serviceVersion} · {props.entry.region}
              </p>
            </SheetHeader>

            <SheetPanel className="flex flex-col gap-6 overflow-y-auto !p-0">
              <InfoSection title="Message" copyValue={props.entry.message} className="px-6 gap-2" contentClass="flex flex-col gap-1.5" titleClass="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                <CodeBlock value={props.entry.message} className="bg-foreground/[0.03] dark:bg-white/[0.03]" preClass="whitespace-pre-wrap text-[12px] text-foreground/90"/>
              </InfoSection>

              <InfoSection title="Identifiers" className="px-6 gap-2" contentClass="flex flex-col gap-1.5" titleClass="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                <KeyValueRow label="Request" value={props.entry.request} mono copyValue={props.entry.request}/>
                <KeyValueRow label="Trace" value={props.entry.traceId} mono copyValue={props.entry.traceId}/>
                <KeyValueRow label="Service" value={`${props.entry.service} · ${props.entry.serviceVersion}`} mono/>
                <KeyValueRow label="Region" value={props.entry.region} mono/>
              </InfoSection>

              <InfoSection title="Context" className="px-6 gap-2" contentClass="flex flex-col gap-1.5" titleClass="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                {props.entry.context.map((c) => (<KeyValueRow key={c.label} label={c.label} value={c.value} mono/>))}
              </InfoSection>

              {props.entry.timing ? (<InfoSection title="Timing" hint={`${props.entry.duration ?? 0}ms total`} className="px-6 gap-2" contentClass="flex flex-col gap-1.5" titleClass="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                  <ul className="flex flex-col gap-2">
                    {props.entry.timing.map((t) => (<li key={t.label}>
                        <div className="flex items-baseline justify-between font-mono text-[11px]">
                          <span className="text-muted-foreground">{t.label}</span>
                          <span className="tabular-nums">{t.ms}ms</span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                          <div className="h-full rounded-full bg-foreground/70" style={{ width: `${t.share}%` }}/>
                        </div>
                      </li>))}
                  </ul>
                </InfoSection>) : null}

              {props.entry.payload ? (<InfoSection title="Payload" copyValue={props.entry.payload.body} className="px-6 gap-2" contentClass="flex flex-col gap-1.5" titleClass="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                  <CodeBlock value={props.entry.payload.body} className="bg-foreground/[0.03] dark:bg-white/[0.03]"/>
                </InfoSection>) : null}

              {props.entry.stack ? (<InfoSection title="Stack" className="px-6 gap-2" contentClass="flex flex-col gap-1.5" titleClass="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                  <ol className="overflow-hidden rounded-md border border-border/60 bg-foreground/[0.03] dark:bg-white/[0.03]">
                    {props.entry.stack.map((line, i) => (<li key={i} className="flex items-baseline gap-3 border-border/40 border-b px-3 py-2 font-mono text-[11px] last:border-b-0">
                        <span className="w-5 text-right text-muted-foreground/70 tabular-nums">
                          {i + 1}
                        </span>
                        <span className="flex-1 truncate text-foreground/85">
                          {line}
                        </span>
                      </li>))}
                  </ol>
                </InfoSection>) : null}

              <div className="px-6 pb-6">
                <Separator className="mb-4"/>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" type="button">
                    <ExternalLinkIcon />
                    Open in tracing
                  </Button>
                  {props.entry.severity === "error" ? (<>
                      <Button size="sm" variant="outline" type="button">
                        <RetryIcon />
                        Retry request
                      </Button>
                      <Button size="sm" variant="outline" type="button">
                        <MailIcon />
                        Notify oncall
                      </Button>
                    </>) : null}
                </div>
              </div>
            </SheetPanel>
          </>) : null}
      </SheetPopup>
    </Sheet>);
}
