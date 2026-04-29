import {
  CornerUpLeftIcon,
  PaperclipIcon,
  ReplyIcon,
  SmileIcon,
  StarIcon,
} from "lucide-solid";
import { Avatar, AvatarFallback } from "@orbit/ui/avatar";
import { Button } from "@orbit/ui/button";
import { Textarea } from "@orbit/ui/textarea";

interface Msg {
  who: string;
  initials: string;
  email: string;
  at: string;
  body: string;
  quoted?: string;
  attachments?: string[];
}

const MSGS: Msg[] = [
  {
    who: "Maya Okafor",
    initials: "MO",
    email: "maya@acme.dev",
    at: "Apr 22 · 09:14",
    body: "Hi James — wanted to share the audit log retention proposal we discussed. The headline is that we lift Business plans from 30 days to 1 year, with deeper export controls. Curious where you'd push back.",
    attachments: ["audit-retention-proposal.pdf · 482 KB"],
  },
  {
    who: "James Lin",
    initials: "JL",
    email: "james@acme.dev",
    at: "Apr 22 · 11:02",
    body: "Loved the framing. Two things: I'd want SSO logs included by default — half the customers who'll buy this will buy it for SOC 2. And the export contract should match our existing CSV schema so we don't break the SDK.",
    quoted: "we lift Business plans from 30 days to 1 year",
  },
  {
    who: "Maya Okafor",
    initials: "MO",
    email: "maya@acme.dev",
    at: "Apr 24 · 14:36",
    body: "Great calls — both folded in. Riya is taking the migration, I'm doing the UI. I'll cut a draft PR by EOW. Want me to loop in legal for the retention copy?",
  },
];

export function TimelinesInboxThreadShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-10 py-10">
      <div class="mx-auto max-w-3xl">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Inbox · thread
        </div>
        <div class="mt-1 flex items-start justify-between">
          <h1 class="font-heading text-2xl leading-tight">
            Audit log retention proposal
          </h1>
          <button
            type="button"
            class="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
          >
            <StarIcon class="size-4" />
          </button>
        </div>
        <div class="mt-1 flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
          <span>3 messages</span>
          <span>·</span>
          <span>2 participants</span>
          <span class="rounded bg-foreground/[0.06] px-1.5 py-0.5 normal-case tracking-normal">
            #design
          </span>
          <span class="rounded bg-foreground/[0.06] px-1.5 py-0.5 normal-case tracking-normal">
            #q2-roadmap
          </span>
        </div>

        <div class="mt-6 overflow-hidden rounded-xl border border-border/60 bg-background/40">
          <ol class="relative divide-y divide-border/40">
            {MSGS.map((m, i) => (
              <li class="grid grid-cols-[40px_1fr] gap-4 px-5 py-5">
                <Avatar class="mt-0.5 size-9">
                  <AvatarFallback class="text-xs">
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="font-medium text-sm">{m.who}</span>
                    <span class="text-muted-foreground text-xs">
                      {m.email}
                    </span>
                    <span class="ml-auto font-mono text-[10px] text-muted-foreground">
                      {m.at}
                    </span>
                  </div>
                  {m.quoted ? (
                    <blockquote class="mt-3 flex gap-3 border-foreground/30 border-l-2 pl-3 text-muted-foreground text-sm italic">
                      <CornerUpLeftIcon class="mt-0.5 size-3 shrink-0 opacity-60" />
                      "{m.quoted}"
                    </blockquote>
                  ) : null}
                  <p class="mt-2 text-foreground/90 text-sm leading-relaxed">
                    {m.body}
                  </p>
                  {m.attachments?.length ? (
                    <div class="mt-3 flex flex-col gap-1.5">
                      {m.attachments.map((a) => (
                        <div

                          class="inline-flex w-fit items-center gap-2 rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-xs"
                        >
                          <PaperclipIcon class="size-3 opacity-60" />
                          {a}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {i < MSGS.length - 1 ? (
                    <div class="mt-3 flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        <ReplyIcon class="size-3" />
                        Reply
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        <SmileIcon class="size-3" />
                        React
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <div class="border-border/60 border-t bg-background p-4">
            <Textarea
              placeholder="Reply to Maya, James — Cmd+Enter to send"
              class="min-h-24"
            />
            <div class="mt-2 flex items-center justify-between">
              <button
                type="button"
                class="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
              >
                <PaperclipIcon class="size-4" />
              </button>
              <div class="flex items-center gap-2">
                <Button variant="ghost" type="button">
                  Save draft
                </Button>
                <Button type="button">Send reply</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
