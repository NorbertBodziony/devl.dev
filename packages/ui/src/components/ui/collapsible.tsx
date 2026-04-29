// @ts-nocheck
import {
  createContext,
  createEffect,
  createSignal,
  splitProps,
  useContext,
} from "solid-js";
import { Primitive } from "./_primitive";
import { cn } from "../../lib/utils";

const CollapsibleContext = createContext<any>();

export function Collapsible(props: any) {
  const [local, others] = splitProps(props, [
    "children",
    "defaultOpen",
    "onOpenChange",
    "open",
  ]);
  const [open, setOpenState] = createSignal(Boolean(local.open ?? local.defaultOpen));

  createEffect(() => {
    if (local.open !== undefined) setOpenState(Boolean(local.open));
  });

  const setOpen = (next: boolean) => {
    if (local.open === undefined) setOpenState(next);
    local.onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <Primitive data-slot="collapsible" {...others}>
        {local.children}
      </Primitive>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger(props: any) {
  const ctx = useContext(CollapsibleContext);
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "onClick",
  ]);

  return (
    <Primitive
      as="button"
      type="button"
      base={cn("cursor-pointer", local.className, local.class)}
      data-panel-open={ctx?.open?.() ? "" : undefined}
      data-slot="collapsible-trigger"
      onClick={(event: MouseEvent) => {
        local.onClick?.(event);
        if (event.defaultPrevented) return;
        ctx?.setOpen?.(!ctx.open());
      }}
      {...others}
    />
  );
}

export function CollapsiblePanel(props: any) {
  const ctx = useContext(CollapsibleContext);
  const [local, others] = splitProps(props, ["class", "className", "style"]);

  return (
    <Primitive
      base={cn(
        "overflow-hidden transition-[height] duration-200",
        local.className,
        local.class,
      )}
      data-slot="collapsible-panel"
      hidden={!ctx?.open?.()}
      style={{
        ...(typeof local.style === "object" && local.style !== null
          ? local.style
          : {}),
      }}
      {...others}
    />
  );
}

export { CollapsiblePanel as CollapsibleContent };
