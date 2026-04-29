import { createSignal } from "solid-js";
import { CopyIcon, KeyIcon, TerminalIcon } from "lucide-solid";
import { Button } from "@orbit/ui/button";
import { Checkbox } from "@orbit/ui/checkbox";
import { Input } from "@orbit/ui/input";
import { Label } from "@orbit/ui/label";
import { cn } from "@orbit/ui/lib/utils";

interface Scope {
  id: string;
  label: string;
  description: string;
  destructive?: boolean;
}

const SCOPES: { group: string; items: Scope[] }[] = [
  {
    group: "Read",
    items: [
      {
        id: "read:projects",
        label: "Projects",
        description: "List and read project metadata.",
      },
      {
        id: "read:members",
        label: "Members",
        description: "List members and their roles.",
      },
      {
        id: "read:audit",
        label: "Audit log",
        description: "Read the last 90 days of activity.",
      },
    ],
  },
  {
    group: "Write",
    items: [
      {
        id: "write:projects",
        label: "Projects",
        description: "Create, update, and archive projects.",
      },
      {
        id: "write:members",
        label: "Members",
        description: "Invite, remove, and change roles.",
        destructive: true,
      },
    ],
  },
];

export function FormsApiKeyShowcasePage() {
  const [name, setName] = createSignal("");
  const [expiry, setExpiry] = createSignal("90");
  const [scopes, setScopes] = createSignal<Set<string>>(
    new Set(["read:projects", "read:members"]),
  );
  const [generated, setGenerated] = createSignal<string | null>(null);
  const [copied, setCopied] = createSignal(false);

  const toggleScope = (id: string) =>
    setScopes((scopeSet) => {
      const next = new Set(scopeSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!name().trim() || scopes().size === 0) return;
    setGenerated(`orb_live_${Math.random().toString(36).slice(2, 18)}`);
  };

  return (
    <>
      {generated() ? (
        <GeneratedKey
          value={generated()!}
          copied={copied()}
          onCopy={() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          }}
          onDone={() => setGenerated(null)}
        />
      ) : (
        <div class="flex min-h-svh items-center justify-center bg-background px-6 py-16 text-foreground">
          <form
            onSubmit={onSubmit}
            class="w-full max-w-lg rounded-2xl border border-border/60 bg-background/60 p-6 shadow-sm"
          >
            <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
              API · new key
            </div>
            <h1 class="mt-1 font-heading text-2xl">Create an API key.</h1>
            <p class="mt-2 text-muted-foreground text-sm">
              Issue a token for a script, integration, or CLI. Scope it tightly.
            </p>

            <div class="mt-6 flex flex-col gap-1.5">
              <Label htmlFor="key-name">Name</Label>
              <Input
                id="key-name"
                type="text"
                placeholder="e.g. CI deploy bot"
                value={name()}
                onChange={(e) => setName(e.target.value)}
                nativeInput
              />
              <p class="text-muted-foreground text-xs">
                For your own bookkeeping — visible to admins only.
              </p>
            </div>

            <div class="mt-6">
              <Label class="font-medium text-sm">Scopes</Label>
              <p class="mt-0.5 text-muted-foreground text-xs">
                Pick the smallest set this key actually needs.
              </p>

              <div class="mt-3 flex flex-col gap-4">
                {SCOPES.map((group) => (
                  <div>
                    <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                      {group.group}
                    </div>
                    <ul class="mt-2 flex flex-col gap-1.5">
                      {group.items.map((scope) => {
                        const checked = () => scopes().has(scope.id);
                        return (
                          <li>
                            <label
                              class={cn(
                                "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                                checked()
                                  ? scope.destructive
                                    ? "border-destructive/40 bg-destructive/[0.04]"
                                    : "border-foreground/30 bg-foreground/[0.03]"
                                  : "border-border/60 bg-background/40 hover:border-border",
                              )}
                            >
                              <Checkbox
                                checked={checked()}
                                onCheckedChange={() => toggleScope(scope.id)}
                                class="mt-0.5"
                              />
                              <div class="flex-1">
                                <div class="flex items-center gap-2">
                                  <span class="font-mono text-[11px] text-foreground">
                                    {scope.id}
                                  </span>
                                  {scope.destructive ? (
                                    <span class="rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[9px] text-destructive uppercase tracking-[0.2em]">
                                      Destructive
                                    </span>
                                  ) : null}
                                </div>
                                <p class="mt-0.5 text-muted-foreground text-xs">
                                  {scope.description}
                                </p>
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div class="mt-6 flex flex-col gap-1.5">
              <Label htmlFor="key-expiry">Expires after</Label>
              <ExpirySelect value={expiry()} onChange={setExpiry} />
            </div>

            <div class="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
              <span class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
                {scopes().size} scope{scopes().size === 1 ? "" : "s"} selected
              </span>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!name().trim() || scopes().size === 0}
                >
                  Generate key
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function GeneratedKey(props: {
  value: string;
  copied: boolean;
  onCopy: () => void;
  onDone: () => void;
}) {
  return (
    <div class="flex min-h-svh items-center justify-center bg-background px-6 text-foreground">
      <div class="w-full max-w-md rounded-2xl border border-border/60 bg-background/60 p-6">
        <div class="inline-flex size-10 items-center justify-center rounded-full bg-foreground/[0.06]">
          <KeyIcon class="size-5" aria-hidden />
        </div>
        <h2 class="mt-4 font-heading text-xl">Your new key.</h2>
        <p class="mt-1 text-muted-foreground text-sm">
          Copy it now — you won't see this again.
        </p>

        <div class="mt-5 flex items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 font-mono text-[12px]">
          <TerminalIcon class="size-3.5 opacity-50" />
          <span class="flex-1 truncate">{props.value}</span>
          <button
            type="button"
            onClick={props.onCopy}
            class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
          >
            <CopyIcon class="size-3" />
            {props.copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div class="mt-6 flex justify-end">
          <Button type="button" onClick={props.onDone}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExpirySelect(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div class="relative">
      <select
        id="key-expiry"
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value)}
        class="h-9 w-full appearance-none rounded-lg border border-input bg-background pl-3 pr-9 text-sm outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/24"
      >
        <option value="7">7 days</option>
        <option value="30">30 days</option>
        <option value="90">90 days</option>
        <option value="365">1 year</option>
        <option value="never">Never</option>
      </select>
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
