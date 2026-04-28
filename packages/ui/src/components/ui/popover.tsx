// @ts-nocheck
import { splitProps } from "solid-js";
import { OverlayPanel, OverlayRoot, OverlayTrigger, Primitive } from "./_primitive";
import { cn } from "../../lib/utils";

export function Popover(props: any) {
  return <OverlayRoot {...props}>{props.children}</OverlayRoot>;
}

export function PopoverTrigger(props: any) {
  return <OverlayTrigger data-slot="popover-trigger" {...props} />;
}

export function PopoverPopup(props: any) {
  const [local, others] = splitProps(props, [
    "align",
    "class",
    "className",
    "side",
    "sideOffset",
    "tooltipStyle",
  ]);

  return (
    <OverlayPanel
      align={local.align ?? "center"}
      side={local.side ?? "bottom"}
      sideOffset={local.sideOffset ?? 4}
      base={cn(
        "z-50 flex rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        local.tooltipStyle &&
          "w-fit text-balance rounded-md text-xs shadow-md/5 before:rounded-[calc(var(--radius-md)-1px)]",
        local.className,
        local.class,
      )}
      data-slot="popover-popup"
      {...others}
    />
  );
}

export const PopoverContent = PopoverPopup;

export function PopoverClose(props: any) {
  return <Primitive as="button" type="button" data-slot="popover-close" {...props} />;
}

export function PopoverTitle(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <Primitive
      base={cn("font-semibold text-lg leading-none", local.className, local.class)}
      data-slot="popover-title"
      {...others}
    />
  );
}

export function PopoverDescription(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <Primitive
      base={cn("text-muted-foreground text-sm", local.className, local.class)}
      data-slot="popover-description"
      {...others}
    />
  );
}
