// @ts-nocheck
import { CheckIcon, XIcon } from "lucide-solid";
import {
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastRoot,
  ToastRow,
  ToastTitle,
  ToastViewport,
} from "@orbit/ui/toast";

export function ToastsSuccessShowcasePage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <FakeAppBackdrop />
      <ToastViewport>
        <Toast />
      </ToastViewport>
    </div>
  );
}

function Toast() {
  return (
    <ToastRoot variant="success" className="w-80 px-3.5 py-3">
      <ToastRow className="items-center">
      <ToastIcon tone="success">
        <CheckIcon className="size-4" />
      </ToastIcon>
      <ToastContent>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription className="mt-0.5 truncate">
          Workspace settings updated.
        </ToastDescription>
      </ToastContent>
      <ToastClose aria-label="Close">
        <XIcon className="size-3.5" />
      </ToastClose>
      </ToastRow>
    </ToastRoot>
  );
}

function FakeAppBackdrop() {
  return (
    <div className="absolute inset-0 grid grid-cols-[200px_1fr] opacity-50">
      <div className="border-r border-border/40 bg-foreground/[0.02] p-4 space-y-2">
        <div className="h-3 w-24 rounded bg-foreground/10" />
        <div className="h-2 w-32 rounded bg-foreground/10" />
        <div className="h-2 w-28 rounded bg-foreground/10" />
        <div className="h-2 w-24 rounded bg-foreground/10" />
      </div>
      <div className="p-10 space-y-3">
        <div className="h-4 w-48 rounded bg-foreground/15" />
        <div className="h-2 w-72 rounded bg-foreground/10" />
        <div className="h-32 rounded-xl border border-border/40 bg-foreground/[0.02]" />
        <div className="h-32 rounded-xl border border-border/40 bg-foreground/[0.02]" />
      </div>
    </div>
  );
}
