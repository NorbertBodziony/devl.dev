import { splitProps, type JSX } from "solid-js";
import { CopyButton } from "./copy-button";
import { cn } from "../../lib/utils";

type NativeDivProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface KeyValueRowProps extends NativeDivProps {
  label: JSX.Element;
  value: JSX.Element;
  className?: string;
  copyValue?: string;
  labelClass?: string;
  mono?: boolean;
  valueClass?: string;
}

export function KeyValueRow(props: KeyValueRowProps) {
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "copyValue",
    "label",
    "labelClass",
    "mono",
    "value",
    "valueClass",
  ]);

  return (
    <div
      {...others}
      class={cn(
        "group flex items-baseline justify-between gap-3 rounded-md px-2 py-1 transition-colors hover:bg-foreground/[0.03]",
        local.className,
        local.class,
      )}
    >
      <span
        class={cn(
          "font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]",
          local.labelClass,
        )}
      >
        {local.label}
      </span>
      <span class="flex min-w-0 items-center gap-1.5">
        <span
          class={cn(
            "max-w-[260px] truncate text-foreground/90",
            local.mono ? "font-mono text-[12px]" : "text-sm",
            local.valueClass,
          )}
        >
          {local.value}
        </span>
        {local.copyValue ? (
          <CopyButton
            value={local.copyValue}
            variant="icon"
            label="Copy"
            className="size-5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
          />
        ) : null}
      </span>
    </div>
  );
}
