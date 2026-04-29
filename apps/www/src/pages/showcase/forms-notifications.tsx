import { createSignal } from "solid-js";
import { BellIcon, MailIcon, MessageSquareIcon } from "lucide-solid";
import { Button } from "@orbit/ui/button";
import { Separator } from "@orbit/ui/separator";
import { Switch } from "@orbit/ui/switch";

interface Pref {
  key: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
}

const SECTIONS: { id: string; title: string; description: string; prefs: Pref[] }[] = [
  {
    id: "activity",
    title: "Activity",
    description: "Things happening in projects you follow.",
    prefs: [
      {
        key: "comments",
        title: "Comments and replies",
        description: "When someone replies to a thread you're in.",
        email: true,
        push: true,
      },
      {
        key: "mentions",
        title: "@mentions",
        description: "When you're called out specifically.",
        email: true,
        push: true,
      },
      {
        key: "assignments",
        title: "Assignments",
        description: "When something is assigned to you.",
        email: true,
        push: false,
      },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    description: "Membership, billing, and admin events.",
    prefs: [
      {
        key: "invites",
        title: "New members",
        description: "Someone joins or accepts an invite.",
        email: false,
        push: false,
      },
      {
        key: "billing",
        title: "Billing receipts",
        description: "Monthly invoices and payment failures.",
        email: true,
        push: false,
      },
    ],
  },
  {
    id: "product",
    title: "Product updates",
    description: "Newsletters and what's new.",
    prefs: [
      {
        key: "weekly",
        title: "Weekly digest",
        description: "A short Monday summary of activity.",
        email: true,
        push: false,
      },
      {
        key: "changelog",
        title: "Changelog highlights",
        description: "Major shipments, ~once a month.",
        email: false,
        push: false,
      },
    ],
  },
];

function initialPrefs() {
  const out: Record<string, { email: boolean; push: boolean }> = {};
  for (const section of SECTIONS) {
    for (const pref of section.prefs) {
      out[pref.key] = { email: pref.email, push: pref.push };
    }
  }
  return out;
}

export function FormsNotificationsShowcasePage() {
  const [prefs, setPrefs] =
    createSignal<Record<string, { email: boolean; push: boolean }>>(
      initialPrefs(),
    );

  const flip = (key: string, channel: "email" | "push") =>
    setPrefs((p) => ({
      ...p,
      [key]: { ...p[key]!, [channel]: !p[key]![channel] },
    }));

  return (
    <div class="min-h-svh bg-background py-16 text-foreground">
      <div class="mx-auto max-w-3xl px-6">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Settings · Notifications
        </div>
        <h1 class="mt-1 font-heading text-3xl">Notifications</h1>
        <p class="mt-2 text-muted-foreground text-sm">
          Pick which moments deserve a tap on the shoulder. Defaults err on the
          quiet side — turn things on as you need them.
        </p>

        <div class="mt-8 flex items-center justify-end gap-6 border-y border-border/60 py-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          <span class="flex w-16 justify-center gap-1.5">
            <MailIcon class="size-3.5 opacity-70" />
            Email
          </span>
          <span class="flex w-16 justify-center gap-1.5">
            <BellIcon class="size-3.5 opacity-70" />
            Push
          </span>
        </div>

        {SECTIONS.map((section) => (
          <section class="mt-8">
            <header>
              <h2 class="font-heading text-base">{section.title}</h2>
              <p class="mt-0.5 text-muted-foreground text-xs">
                {section.description}
              </p>
            </header>

            <ul class="mt-4 divide-y divide-border/50 rounded-xl border border-border/60 bg-background/40">
              {section.prefs.map((pref) => {
                const value = () => prefs()[pref.key]!;
                return (
                  <li class="flex items-center gap-6 px-4 py-3.5">
                    <div class="min-w-0 flex-1">
                      <div class="font-medium text-sm">{pref.title}</div>
                      <p class="mt-0.5 truncate text-muted-foreground text-xs">
                        {pref.description}
                      </p>
                    </div>
                    <div class="flex items-center justify-center gap-6">
                      <div class="flex w-16 justify-center">
                        <Switch
                          checked={value().email}
                          onCheckedChange={() => flip(pref.key, "email")}
                        />
                      </div>
                      <div class="flex w-16 justify-center">
                        <Switch
                          checked={value().push}
                          onCheckedChange={() => flip(pref.key, "push")}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <Separator class="my-10" />

        <div class="rounded-xl border border-border/60 bg-background/40 p-4">
          <div class="flex items-start gap-3">
            <MessageSquareIcon class="mt-0.5 size-4 opacity-60" />
            <div class="flex-1">
              <div class="font-medium text-sm">Quiet hours</div>
              <p class="mt-0.5 text-muted-foreground text-xs">
                Push notifications are paused between 10pm and 8am in your
                workspace timezone.
              </p>
            </div>
            <Button variant="outline" size="sm" type="button">
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
