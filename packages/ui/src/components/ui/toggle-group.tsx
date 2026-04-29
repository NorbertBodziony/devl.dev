// @ts-nocheck
import { createContext, createEffect, createSignal, splitProps, useContext } from "solid-js";
import { Primitive } from "./_primitive";
import { Separator } from "./separator";
import { Toggle, toggleVariants } from "./toggle";
import { cn } from "../../lib/utils";

const ToggleGroupContext = createContext<any>({ size: "default", variant: "default" });

export function ToggleGroup(props: any) {
  const [local, others] = splitProps(props, [
    "children",
    "class",
    "className",
    "defaultValue",
    "onValueChange",
    "orientation",
    "size",
    "value",
    "variant",
  ]);
  const orientation = () => local.orientation ?? "horizontal";
  const variant = () => local.variant ?? "default";
  const size = () => local.size ?? "default";
  const [value, setValue] = createSignal(local.value ?? local.defaultValue ?? []);

  createEffect(() => {
    if (local.value !== undefined) setValue(local.value);
  });

  const setItem = (item: string, pressed: boolean) => {
    const current = Array.isArray(value()) ? value() : [value()].filter(Boolean);
    const next = pressed
      ? Array.from(new Set([...current, item]))
      : current.filter((v: string) => v !== item);
    if (local.value === undefined) setValue(next);
    local.onValueChange?.(next);
  };

  return (
    <ToggleGroupContext.Provider
      value={{
        isPressed: (item: string) => (Array.isArray(value()) ? value() : [value()]).includes(item),
        setItem,
        size,
        variant,
      }}
    >
      <Primitive
        role="group"
        base={cn(
          "flex w-fit *:focus-visible:z-10 dark:*:[[data-slot=separator]:has(+[data-slot=toggle]:hover)]:before:bg-input/64 dark:*:[[data-slot=separator]:has(+[data-slot=toggle][data-pressed])]:before:bg-input dark:*:[[data-slot=toggle]:hover+[data-slot=separator]]:before:bg-input/64 dark:*:[[data-slot=toggle][data-pressed]+[data-slot=separator]]:before:bg-input",
          orientation() === "horizontal"
            ? "*:pointer-coarse:after:min-w-auto"
            : "*:pointer-coarse:after:min-h-auto",
          variant() === "default"
            ? "gap-0.5"
            : orientation() === "horizontal"
              ? "*:not-first:rounded-s-none *:not-last:rounded-e-none *:not-first:border-s-0 *:not-last:border-e-0 *:not-first:not-data-[slot=separator]:before:-start-[0.5px] *:not-last:not-data-[slot=separator]:before:-end-[0.5px] *:not-first:before:rounded-s-none *:not-last:before:rounded-e-none"
              : "flex-col *:not-first:rounded-t-none *:not-last:rounded-b-none *:not-first:border-t-0 *:not-last:border-b-0 *:not-first:not-data-[slot=separator]:before:-top-[0.5px] *:not-last:not-data-[slot=separator]:before:-bottom-[0.5px] *:not-first:before:rounded-t-none *:not-last:before:rounded-b-none *:data-[slot=toggle]:not-last:before:hidden dark:*:last:before:hidden dark:*:first:before:block",
          local.className,
          local.class,
        )}
        data-orientation={orientation()}
        data-size={size()}
        data-slot="toggle-group"
        data-variant={variant()}
        {...others}
      >
        {local.children}
      </Primitive>
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem(props: any) {
  const ctx = useContext(ToggleGroupContext);
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "onClick",
    "size",
    "value",
    "variant",
  ]);
  const resolvedSize = () => ctx.size?.() ?? local.size ?? "default";
  const resolvedVariant = () => ctx.variant?.() ?? local.variant ?? "default";
  const pressed = () => ctx.isPressed?.(local.value);

  return (
    <Toggle
      class={cn(local.className, local.class)}
      data-size={resolvedSize()}
      data-variant={resolvedVariant()}
      pressed={pressed()}
      size={resolvedSize()}
      variant={resolvedVariant()}
      onClick={(event: MouseEvent) => {
        local.onClick?.(event);
        if (event.defaultPrevented) return;
        ctx.setItem?.(local.value, !pressed());
      }}
      {...others}
    />
  );
}

export function ToggleGroupSeparator(props: any) {
  const [local, others] = splitProps(props, ["class", "className", "orientation"]);
  return (
    <Separator
      class={cn(
        "pointer-events-none relative bg-input before:absolute before:inset-0 dark:before:bg-input/32",
        local.className,
        local.class,
      )}
      orientation={local.orientation ?? "vertical"}
      {...others}
    />
  );
}
