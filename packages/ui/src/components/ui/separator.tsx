import { splitProps, type ComponentProps } from "solid-js";
import { cn } from "../../lib/utils";
import type { ClassProps } from "./_primitive";

export interface SeparatorProps
  extends Omit<ComponentProps<"div">, "class">,
    ClassProps {
  orientation?: "horizontal" | "vertical";
}

export function Separator(props: SeparatorProps) {
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "orientation",
  ]);
  const orientation = () => local.orientation ?? "horizontal";

  return (
    <div
      role="separator"
      aria-orientation={orientation()}
      class={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
        local.className,
        local.class,
      )}
      data-orientation={orientation()}
      data-slot="separator"
      {...others}
    />
  );
}
