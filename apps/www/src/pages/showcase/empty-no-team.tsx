import { CopyIcon, MailPlusIcon } from "lucide-solid";
import { Button } from "@orbit/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@orbit/ui/input-group";

export function EmptyNoTeamShowcasePage() {
  const inviteUrl = "https://orbit.so/invite/8f3a2c";
  return (
    <div class="relative min-h-svh overflow-hidden bg-background">
      <Backdrop />
      <div class="relative mx-auto flex min-h-svh max-w-xl flex-col items-center justify-center px-6 text-center">
        <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.4em]">
          Members · 1
        </div>

        <PlaceholderAvatars />

        <h1 class="mt-1 max-w-md font-heading text-3xl leading-tight md:text-4xl">
          It's just you in here.
        </h1>
        <p class="mt-3 max-w-sm text-muted-foreground text-sm leading-relaxed">
          Add teammates to share projects, leave comments, and review each
          other's work.
        </p>

        <div class="mt-8 w-full max-w-md space-y-3">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <span class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                Invite link
              </span>
            </InputGroupAddon>
            <InputGroupInput readOnly value={inviteUrl} nativeInput />
            <InputGroupAddon align="inline-end">
              <Button size="xs" variant="ghost" type="button">
                <CopyIcon />
                Copy
              </Button>
            </InputGroupAddon>
          </InputGroup>

          <Button size="default" class="w-full" type="button">
            <MailPlusIcon />
            Invite by email
          </Button>

          <p class="pt-1 text-muted-foreground text-xs">
            Anyone with the link can join as a member. Change in{" "}
            <a
              href="#"
              class="text-foreground underline-offset-4 hover:underline"
            >
              workspace settings
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderAvatars() {
  const initials = ["S", "?", "?", "?"];
  return (
    <div class="mt-6 mb-5 flex items-center -space-x-2">
      {initials.map((c, i) => (
        <div

          class={
            i === 0
              ? "z-10 flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground font-medium text-background text-xs shadow-sm"
              : "flex size-10 items-center justify-center rounded-full border-2 border-dashed border-border/70 bg-background/40 font-medium text-[11px] text-muted-foreground backdrop-blur"
          }
          style={{ "z-index": i === 0 ? 10 : 4 - i }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

function Backdrop() {
  return (
    <div
      aria-hidden
      class="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        class="absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, color-mix(in srgb, var(--foreground) 5%, transparent) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
