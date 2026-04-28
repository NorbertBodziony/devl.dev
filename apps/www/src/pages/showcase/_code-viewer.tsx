// @ts-nocheck
import { createMemo } from "solid-js";
import { createSignal } from "solid-js";
import { ChevronDownIcon } from "lucide-solid";
import { Dialog, DialogBackdrop, DialogPortal, DialogPrimitive, DialogViewport, } from "@orbit/ui/dialog";
import { ScrollArea } from "@orbit/ui/scroll-area";
import { cn } from "@orbit/ui/lib/utils";
import { CodeBlock } from "@orbit/ui/code-block";
import { CopyButton } from "@orbit/ui/copy-button";
import type { CategorySlug } from "@/lib/designs";
import { getSourceFile } from "./source-files";
const RAW_SOURCES = import.meta.glob("./*.tsx", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;
function getSource(category: CategorySlug, design: string): {
    filename: string;
    code: string;
} | null {
    const filename = getSourceFile(category, design);
    if (!filename)
        return null;
    const code = RAW_SOURCES[`./${filename}.tsx`];
    if (!code)
        return null;
    return { filename, code };
}
interface CodeViewerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: CategorySlug;
    design: string;
    title: string;
}
const SETUP_COMMANDS: {
    label: string;
    value: string;
}[] = [
    { label: "Install Solid", value: "bun add solid-js lucide-solid" },
    { label: "Copy UI files", value: "Use the files included in this registry item" },
];
export function CodeViewer(props: CodeViewerProps) {
    const source = createMemo(() => getSource(props.category, props.design));
    const [setupOpen, setSetupOpen] = createSignal(false);
    const registryUrl = createMemo(() => typeof window !== "undefined"
        ? `${window.location.origin}/r/${props.category}/${props.design}.json`
        : `/r/${props.category}/${props.design}.json`);
    const installCommand = createMemo(() => `bunx shadcn@latest add ${registryUrl()}`);
    return (<Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogPortal>
        <DialogBackdrop forceMount />
        <DialogViewport forceMount className="grid-rows-[1fr_auto_1fr] p-4 sm:p-8">
          <DialogPrimitive.Popup forceMount data-slot="dialog-popup" className="relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-3xl origin-center flex-col overflow-hidden rounded-2xl bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-var(--nested-dialogs))] outline-none will-change-transform [transition-property:scale,opacity,translate] duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[inset_0_1px_--theme(--color-white/64%)] shadow-[0_0_0_1px_--theme(--color-black/8%),0_1px_2px_--theme(--color-black/6%),0_12px_32px_-8px_--theme(--color-black/18%),0_32px_64px_-16px_--theme(--color-black/24%)] data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-[calc(1-0.1*var(--nested-dialogs))] sm:data-ending-style:scale-96 sm:data-starting-style:scale-96 dark:before:shadow-[inset_0_1px_--theme(--color-white/6%)] dark:shadow-[0_0_0_1px_--theme(--color-white/10%),0_1px_2px_--theme(--color-black/60%),0_12px_32px_-8px_--theme(--color-black/70%),0_32px_64px_-16px_--theme(--color-black/80%)]">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3">
              <div className="flex min-w-0 flex-col">
                <DialogPrimitive.Title className="truncate font-heading font-semibold text-[15px] leading-tight">
                  {props.title}
                </DialogPrimitive.Title>
                {source() ? (<span className="font-mono text-[11px] text-muted-foreground">
                    {source()!.filename}.tsx
                  </span>) : null}
              </div>
              <CopyButton value={source()?.code ?? ""} disabled={!source()} label="Copy code" variant="outline"/>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-background">
              {source() ? (<ScrollArea className="h-full">
                  <CodeBlock value={source()!.code.trimEnd()} showLineNumbers className="border-0 bg-transparent" preClass="m-0 px-4 py-4 text-[12px] leading-[1.55]"/>
                </ScrollArea>) : (<div className="flex h-full items-center justify-center p-8 text-muted-foreground text-sm">
                  Source file not found.
                </div>)}
            </div>

            <div className="flex flex-col gap-2 border-t border-border/60 bg-background px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Install Solid source
                </div>
                <button type="button" onClick={() => setSetupOpen((v) => !v)} aria-expanded={setupOpen()} className="flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground">
                  First time? Setup
                  <ChevronDownIcon className={cn("size-3.5 transition-transform", setupOpen() && "rotate-180")}/>
                </button>
              </div>

              {setupOpen() ? (<div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-background/40 p-2.5">
                  <div className="text-[11px] text-muted-foreground">
                    These registry entries include the Solid component source
                    and the local UI files they use:
                  </div>
                  {SETUP_COMMANDS.map((cmd) => (<div key={cmd.value} className="flex items-center gap-2">
                      <code className="min-w-0 flex-1 truncate rounded-md border border-border/60 bg-background px-2.5 py-1.5 font-mono text-[12px]">
                        {cmd.value}
                      </code>
                      <CopyButton value={cmd.value} label="Copy" variant="outline"/>
                    </div>))}
                </div>) : null}

              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-md border border-border/60 bg-background px-2.5 py-1.5 font-mono text-[12px]">
                  {installCommand()}
                </code>
                <CopyButton value={installCommand()} label="Copy command" variant="outline"/>
              </div>
            </div>
          </DialogPrimitive.Popup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>);
}
