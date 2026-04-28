// @ts-nocheck
import { GitPullRequestIcon, MessageCircleIcon, UserPlusIcon, XIcon } from "lucide-solid";
import {
  ToastAction,
  ToastActions,
  ToastAvatar,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastMeta,
  ToastRoot,
  ToastRow,
  ToastTitle,
  ToastViewport,
} from "@orbit/ui/toast";

interface ToastSpec {
  Icon: ComponentType<{ className?: string }>;
  badgeTone: string;
  title: string;
  body: string;
  meta: string;
  actions?: { label: string; primary?: boolean }[];
  avatar?: { initials: string; tone: string };
}

const TOASTS: ToastSpec[] = [
  {
    Icon: UserPlusIcon,
    badgeTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    title: "Maya joined the workspace",
    body: "Auto-joined via @acme.com domain rule. Say hi or assign a project.",
    meta: "just now",
    actions: [{ label: "Assign" }, { label: "Welcome", primary: true }],
    avatar: { initials: "MO", tone: "bg-emerald-500/85 text-white" },
  },
  {
    Icon: GitPullRequestIcon,
    badgeTone: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    title: "PR #128 ready for review",
    body: "James moved \"audit log query rewrite\" to ready.",
    meta: "2m ago",
    actions: [{ label: "Snooze" }, { label: "Review", primary: true }],
    avatar: { initials: "JL", tone: "bg-amber-500/85 text-white" },
  },
  {
    Icon: MessageCircleIcon,
    badgeTone: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    title: "Riya replied",
    body: "@sean — same — let's pair on the bouncing invites tomorrow morning.",
    meta: "12m ago",
    actions: [{ label: "Reply" }],
    avatar: { initials: "RP", tone: "bg-violet-500/85 text-white" },
  },
];

export function ToastsRichShowcasePage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <FakeAppBackdrop />
      <ToastViewport stacked className="w-[380px]">
        {TOASTS.map((t, i) => (
          <ToastRoot
            key={i}
            variant="rich"
            className="p-3.5"
          >
            <ToastRow>
              {t.avatar ? (
                <ToastAvatar initials={t.avatar.initials} className={t.avatar.tone}/>
              ) : null}
              <ToastContent>
                <div className="flex items-center gap-2">
                  <ToastIcon size="sm" className={t.badgeTone}>
                    <t.Icon className="size-3" />
                  </ToastIcon>
                  <ToastTitle className="truncate">{t.title}</ToastTitle>
                </div>
                <ToastDescription>
                  {t.body}
                </ToastDescription>
                <div className="mt-2.5 flex items-center justify-between">
                  <ToastMeta>{t.meta}</ToastMeta>
                  {t.actions ? (
                    <ToastActions>
                      {t.actions.map((a) => (
                        <ToastAction
                          key={a.label}
                          variant={a.primary ? "default" : "ghost"}
                        >
                          {a.label}
                        </ToastAction>
                      ))}
                    </ToastActions>
                  ) : null}
                </div>
              </ToastContent>
              <ToastClose className="-mr-1 -mt-1">
                <XIcon className="size-3.5" />
              </ToastClose>
            </ToastRow>
          </ToastRoot>
        ))}
      </ToastViewport>
    </div>
  );
}

function FakeAppBackdrop() {
  return (
    <div className="absolute inset-0 p-10 opacity-50 space-y-3">
      <div className="h-4 w-56 rounded bg-foreground/15" />
      <div className="h-2 w-72 rounded bg-foreground/10" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-border/40 bg-foreground/[0.02]"
          />
        ))}
      </div>
    </div>
  );
}
