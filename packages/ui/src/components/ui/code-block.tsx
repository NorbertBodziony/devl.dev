import { type JSX } from "solid-js";
import { CopyButton } from "./copy-button";
import { cn } from "../../lib/utils";

type NativeDivProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface CodeBlockProps extends Omit<NativeDivProps, "children"> {
  value: string;
  className?: string;
  label?: JSX.Element;
  status?: JSX.Element;
  children?: JSX.Element;
  showLineNumbers?: boolean;
  copy?: boolean;
  bodyClass?: string;
  preClass?: string;
}

export function CodeBlock(props: CodeBlockProps) {
  const hasHeader = () => props.label !== undefined || props.status !== undefined || props.copy;
  const lines = () => props.value.trim().split("\n");

  return (
    <div
      class={cn("overflow-hidden rounded-md border border-border/60 bg-background", props.className, props.class)}
    >
      {hasHeader() ? (
        <div class="flex items-center justify-between border-b border-border/60 px-2.5 py-1.5">
          <div class="flex items-center gap-2">
            {props.label !== undefined ? (
              <span class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                {props.label}
              </span>
            ) : null}
            {props.status}
          </div>
          {props.copy ? <CopyButton value={props.value} /> : null}
        </div>
      ) : null}
      <div class={props.bodyClass}>
        {props.children ?? (
          <pre
            class={cn(
              "overflow-x-auto px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/85",
              props.preClass,
            )}
          >
            {props.showLineNumbers
              ? lines().map((line, index) => (
                  <div class="table-row">
                    <span class="table-cell select-none pr-3 text-right text-muted-foreground/40 tabular-nums">
                      {index + 1}
                    </span>
                    <span class="table-cell whitespace-pre">{line}</span>
                  </div>
                ))
              : props.value}
          </pre>
        )}
      </div>
    </div>
  );
}
