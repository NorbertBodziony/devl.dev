// @ts-nocheck
import {
  createContext,
  createEffect,
  createSignal,
  splitProps,
  useContext,
} from "solid-js";
import { ChevronsUpDownIcon } from "lucide-solid";
import { cn } from "../../lib/utils";

const Ctx = createContext<any>();

const triggerBase =
  "relative inline-flex min-h-9 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/24 disabled:pointer-events-none disabled:opacity-64 sm:min-h-8 sm:text-sm dark:bg-input/32 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";
const triggerSizes = {
  default: "",
  lg: "min-h-10 sm:min-h-9",
  sm: "min-h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:min-h-7",
};

export function Select(props: any) {
  const [value, setValue] = createSignal(
    props.value ?? props.defaultValue ?? props.items?.[0]?.value,
  );
  const [open, setOpen] = createSignal(false);
  createEffect(() => {
    if (props.value !== undefined) setValue(props.value);
  });
  const set = (v: any) => {
    setValue(v);
    props.onValueChange?.(v);
  };
  return (
    <Ctx.Provider value={{ value, set, items: props.items || [], open, setOpen }}>
      <div class="relative inline-flex">{props.children}</div>
    </Ctx.Provider>
  );
}

export function SelectTrigger(props: any) {
  const ctx = useContext(Ctx);
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "children",
    "disabled",
    "onClick",
    "size",
  ]);
  return (
    <button
      type="button"
      {...others}
      class={cn(
        triggerBase,
        triggerSizes[local.size ?? "default"],
        local.className,
        local.class,
      )}
      data-slot="select-trigger"
      disabled={local.disabled}
      onClick={(event) => {
        local.onClick?.(event);
        ctx?.setOpen?.(!ctx.open());
      }}
    >
      {local.children}
      <ChevronsUpDownIcon class="-me-1 size-4 opacity-80" />
    </button>
  );
}

export function SelectValue(props: any) {
  const ctx = useContext(Ctx);
  const item = () => ctx?.items?.find((i: any) => i.value === ctx.value());
  return (
    <span class="flex-1 truncate text-left">
      {props.children || item()?.label || ctx?.value?.()}
    </span>
  );
}

export function SelectPopup(props: any) {
  const ctx = useContext(Ctx);
  return (
    <>
      {ctx?.open?.() ? (
      <div
        {...props}
        class={cn(
          "absolute left-0 top-[calc(100%+0.25rem)] z-50 min-w-full rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg/5",
          props.className,
          props.class,
        )}
      />
      ) : null}
    </>
  );
}

export function SelectItem(props: any) {
  const ctx = useContext(Ctx);
  const [local, others] = splitProps(props, ["class", "className", "children", "onClick", "value"]);
  return (
    <button
      type="button"
      {...others}
      class={cn(
        "flex min-h-8 w-full items-center rounded-sm px-2 py-1 text-left text-sm outline-none hover:bg-accent",
        local.className,
        local.class,
      )}
      onClick={(event) => {
        local.onClick?.(event);
        ctx?.set(local.value);
        ctx?.setOpen?.(false);
      }}
    >
      {local.children}
    </button>
  );
}
