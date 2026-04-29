import { createSignal, splitProps, type ComponentProps, type JSX } from "solid-js";
import {
  CreditCardIcon,
  KeyIcon,
  PuzzleIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldAlertIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-solid";
import { Button } from "@orbit/ui/button";
import { Input } from "@orbit/ui/input";
import { Label } from "@orbit/ui/label";
import { Separator } from "@orbit/ui/separator";
import { Switch } from "@orbit/ui/switch";
import { cn } from "@orbit/ui/lib/utils";

const NAV = [
  { icon: SettingsIcon, label: "General", active: true },
  { icon: UsersIcon, label: "Members" },
  { icon: CreditCardIcon, label: "Billing" },
  { icon: KeyIcon, label: "API keys" },
  { icon: PuzzleIcon, label: "Integrations" },
  { icon: ScrollTextIcon, label: "Audit log" },
];

export function FormsWorkspaceSettingsShowcasePage() {
  const [name, setName] = createSignal("Acme inc.");
  const [slug, setSlug] = createSignal("acme");
  const [dirty, setDirty] = createSignal(false);

  return (
    <div class="min-h-svh bg-background text-foreground">
      <div class="mx-auto grid min-h-svh max-w-5xl grid-cols-[220px_1fr]">
        <aside class="border-r border-border/60 px-4 py-8">
          <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            Workspace
          </div>
          <div class="mt-1 truncate font-heading text-lg">{name()}</div>
          <ul class="mt-6 flex flex-col gap-0.5">
            {NAV.map(({ icon: Icon, label, active }) => (
              <li>
                <button
                  type="button"
                  class={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground",
                  )}
                >
                  <Icon class="size-4 opacity-70" />
                  {label}
                </button>
              </li>
            ))}
            <li class="mt-3">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/[0.06]"
              >
                <ShieldAlertIcon class="size-4 opacity-70" />
                Danger zone
              </button>
            </li>
          </ul>
        </aside>

        <main class="px-10 py-12 pb-32">
          <header class="flex items-end justify-between border-b border-border/60 pb-6">
            <div>
              <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
                Settings · General
              </div>
              <h1 class="mt-1 font-heading text-2xl">General</h1>
              <p class="mt-1 text-muted-foreground text-sm">
                Workspace identity, region, and default behaviours.
              </p>
            </div>
          </header>

          <Section title="Identity" hint="Visible to anyone with access.">
            <div class="flex items-center gap-4">
              <div class="size-14 rounded-lg bg-gradient-to-br from-primary/40 to-primary/10 ring-1 ring-border/60" />
              <div class="flex-1">
                <Button size="sm" variant="outline" type="button">
                  <UploadIcon />
                  Upload avatar
                </Button>
                <p class="mt-1.5 text-muted-foreground text-xs">
                  PNG or SVG, 1024×1024 max.
                </p>
              </div>
            </div>

            <Field label="Name" htmlFor="ws-name">
              <Input
                id="ws-name"
                value={name()}
                onChange={(e) => {
                  setName(e.target.value);
                  setDirty(true);
                }}
                nativeInput
              />
            </Field>

            <Field label="Slug" htmlFor="ws-slug" hint="Used in URLs.">
              <div class="flex h-9 items-center gap-1 rounded-lg border border-input bg-background px-3 font-mono text-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/24">
                <span class="text-muted-foreground">orbit.so/</span>
                <input
                  id="ws-slug"
                  value={slug()}
                  onInput={(e) => {
                    setSlug(e.currentTarget.value);
                    setDirty(true);
                  }}
                  class="flex-1 bg-transparent outline-none"
                />
              </div>
            </Field>
          </Section>

          <Separator class="my-10" />

          <Section
            title="Region"
            hint="Defaults applied to new members and exports."
          >
            <Field label="Timezone" htmlFor="ws-tz">
              <NativeSelect
                id="ws-tz"
                value="utc-5"
                onChange={() => setDirty(true)}
              >
                <option value="utc-8">Pacific (UTC−8)</option>
                <option value="utc-5">Eastern (UTC−5)</option>
                <option value="utc">UTC</option>
                <option value="utc+1">Central European (UTC+1)</option>
                <option value="utc+9">Japan (UTC+9)</option>
              </NativeSelect>
            </Field>
            <Field label="Date format" htmlFor="ws-fmt">
              <NativeSelect
                id="ws-fmt"
                value="ymd"
                onChange={() => setDirty(true)}
              >
                <option value="ymd">YYYY-MM-DD</option>
                <option value="dmy">DD/MM/YYYY</option>
                <option value="mdy">MM/DD/YYYY</option>
              </NativeSelect>
            </Field>
          </Section>

          <Separator class="my-10" />

          <Section title="Defaults">
            <SwitchRow
              title="Public sign-up"
              description="Anyone with a workspace email can request access."
              defaultChecked
              onChange={() => setDirty(true)}
            />
            <SwitchRow
              title="Two-factor for admins"
              description="Require a second factor for owner and admin roles."
              defaultChecked
              onChange={() => setDirty(true)}
            />
            <SwitchRow
              title="Show project IDs"
              description="Display the short ID next to project names everywhere."
              onChange={() => setDirty(true)}
            />
          </Section>
        </main>
      </div>

      <div class="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-10 py-3">
          <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            {dirty() ? "Unsaved changes" : "All saved"}
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setDirty(false)}
              disabled={!dirty()}
            >
              Discard
            </Button>
            <Button size="sm" type="button" disabled={!dirty()}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section(props: {
  title: string;
  hint?: string;
  children: JSX.Element;
}) {
  return (
    <section class="mt-8 grid grid-cols-[180px_minmax(0,1fr)] gap-x-10 gap-y-6">
      <div>
        <h2 class="font-medium text-sm">{props.title}</h2>
        {props.hint ? (
          <p class="mt-1 text-muted-foreground text-xs leading-relaxed">
            {props.hint}
          </p>
        ) : null}
      </div>
      <div class="flex flex-col gap-5">{props.children}</div>
    </section>
  );
}

function Field(props: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: JSX.Element;
}) {
  return (
    <div class="flex flex-col gap-1.5">
      <Label htmlFor={props.htmlFor}>{props.label}</Label>
      {props.children}
      {props.hint ? (
        <p class="text-muted-foreground text-xs">{props.hint}</p>
      ) : null}
    </div>
  );
}

function NativeSelect(
  props: ComponentProps<"select"> & { class?: string; className?: string },
) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <div class="relative">
      <select
        class={cn(
          "h-9 w-full appearance-none rounded-lg border border-input bg-background pl-3 pr-9 text-sm outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/24",
          local.className,
          local.class,
        )}
        {...others}
      />
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden
        class="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 opacity-60"
      >
        <polyline points="4 6 8 10 12 6" />
      </svg>
    </div>
  );
}

function SwitchRow(props: {
  title: string;
  description: string;
  defaultChecked?: boolean;
  onChange?: () => void;
}) {
  return (
    <div class="flex items-start justify-between gap-6 rounded-lg border border-border/60 bg-background/40 px-4 py-3">
      <div>
        <div class="font-medium text-sm">{props.title}</div>
        <p class="mt-0.5 text-muted-foreground text-xs leading-relaxed">
          {props.description}
        </p>
      </div>
      <Switch
        defaultChecked={props.defaultChecked}
        onCheckedChange={() => props.onChange?.()}
      />
    </div>
  );
}
