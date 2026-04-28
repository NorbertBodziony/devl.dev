// @ts-nocheck
import { AlertCircleIcon, RotateCcwIcon, XIcon } from "lucide-solid";
import {
  ToastAction,
  ToastActions,
  ToastBadge,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastRoot,
  ToastRow,
  ToastTitle,
  ToastViewport,
} from "@orbit/ui/toast";

export function ToastsErrorRetryShowcasePage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <FakeAppBackdrop />
      <ToastViewport className="w-96">
        <ToastRoot variant="error">
          <div className="flex items-start gap-3 p-3.5">
            <ToastIcon tone="error">
              <AlertCircleIcon className="size-4" />
            </ToastIcon>
            <ToastContent>
              <div className="flex items-center gap-2">
                <ToastTitle>Couldn't send invite</ToastTitle>
                <ToastBadge tone="error">503</ToastBadge>
              </div>
              <ToastDescription>
                Email gateway is unreachable right now. We'll keep your draft —
                try again or write to support.
              </ToastDescription>
            </ToastContent>
            <ToastClose aria-label="Close">
              <XIcon className="size-3.5" />
            </ToastClose>
          </div>
          <ToastActions className="justify-end gap-2 border-t border-border/60 px-3 py-2">
            <ToastAction size="sm" variant="ghost">
              Dismiss
            </ToastAction>
            <ToastAction size="sm" variant="outline">
              <RotateCcwIcon />
              Retry
            </ToastAction>
          </ToastActions>
        </ToastRoot>
      </ToastViewport>
    </div>
  );
}

function FakeAppBackdrop() {
  return (
    <div className="absolute inset-0 grid grid-cols-[200px_1fr] opacity-50">
      <div className="border-r border-border/40 bg-foreground/[0.02] p-4 space-y-2">
        <div className="h-3 w-24 rounded bg-foreground/10" />
        <div className="h-2 w-32 rounded bg-foreground/10" />
        <div className="h-2 w-28 rounded bg-foreground/10" />
      </div>
      <div className="p-10 space-y-3">
        <div className="h-4 w-48 rounded bg-foreground/15" />
        <div className="h-2 w-72 rounded bg-foreground/10" />
        <div className="h-40 rounded-xl border border-border/40 bg-foreground/[0.02]" />
      </div>
    </div>
  );
}
