// @ts-nocheck
import { createCleanupEffect } from "@/lib/solid-lifecycle";
import { createSignal } from "solid-js";
import { TrashIcon, XIcon } from "lucide-solid";
import {
    ToastClose,
    ToastContent,
    ToastDescription,
    ToastIcon,
    ToastProgress,
    ToastRoot,
    ToastTitle,
    ToastViewport,
} from "@orbit/ui/toast";
export function ToastsUndoShowcasePage() {
    const [remaining, setRemaining] = createSignal(8);
    createCleanupEffect(() => {
        const t = window.setInterval(() => {
            setRemaining((r) => (r > 0 ? r - 0.05 : 0));
        }, 50);
        return () => window.clearInterval(t);
    }, []);
    const pct = () => Math.max(0, (remaining() / 8) * 100);
    return (<div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <FakeAppBackdrop />
      <ToastViewport position="bottom-center" className="w-96">
        <ToastRoot variant="inverse">
          <div className="flex items-center gap-3 px-3.5 py-2.5">
            <ToastIcon tone="inverse">
              <TrashIcon className="size-3.5"/>
            </ToastIcon>
            <ToastContent>
              <ToastTitle>Project archived</ToastTitle>
              <ToastDescription className="mt-0.5 truncate text-background/70">
                "Q3 planning" moved to archive.
              </ToastDescription>
            </ToastContent>
            <button type="button" className="rounded-md bg-background/15 px-2.5 py-1 font-medium text-xs transition-colors hover:bg-background/25">
              Undo
            </button>
            <ToastClose inverse>
              <XIcon className="size-3.5"/>
            </ToastClose>
          </div>
          <ToastProgress inverse value={pct()} className="h-0.5 rounded-none"/>
        </ToastRoot>
        <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          {remaining() > 0 ? `${remaining().toFixed(1)}s left to undo` : "Permanent"}
        </div>
      </ToastViewport>
    </div>);
}
function FakeAppBackdrop() {
    return (<div className="absolute inset-0 p-10 opacity-50 space-y-3">
      <div className="h-4 w-56 rounded bg-foreground/15"/>
      <div className="h-2 w-72 rounded bg-foreground/10"/>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (<div key={i} className="h-24 rounded-xl border border-border/40 bg-foreground/[0.02]"/>))}
      </div>
    </div>);
}
