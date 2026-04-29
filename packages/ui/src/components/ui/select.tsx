// @ts-nocheck
import {
  createContext,
  createEffect,
  createSignal,
  splitProps,
  useContext,
} from "solid-js";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { cn } from "../../lib/utils";

const Ctx = createContext<any>();

const triggerBase =
  "relative inline-flex min-h-9 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none";
const triggerSizes = {
  default: "",
  lg: "min-h-10 sm:min-h-9",
  sm: "min-h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:min-h-7",
};
const selectTriggerIconClassName = "-me-1 size-4.5 opacity-80 sm:size-4";

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
      data-disabled={local.disabled ? "" : undefined}
      data-slot="select-trigger"
      disabled={local.disabled}
      onClick={(event) => {
        local.onClick?.(event);
        ctx?.setOpen?.(!ctx.open());
      }}
    >
      {local.children}
      <ChevronsUpDownIcon class={selectTriggerIconClassName} data-slot="select-icon" />
    </button>
  );
}

export function SelectValue(props: any) {
  const ctx = useContext(Ctx);
  const item = () => ctx?.items?.find((i: any) => i.value === ctx.value());
  return (
    <span
      class={cn("flex-1 truncate text-left data-placeholder:text-muted-foreground", props.className, props.class)}
      data-slot="select-value"
    >
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
          "absolute left-0 top-[calc(100%+0.25rem)] z-50 min-w-full select-none rounded-lg border bg-popover not-dark:bg-clip-padding p-1 text-foreground shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          props.className,
          props.class,
        )}
        data-slot="select-popup"
      />
      ) : null}
    </>
  );
}

export function SelectItem(props: any) {
  const ctx = useContext(Ctx);
  const [local, others] = splitProps(props, ["class", "className", "children", "onClick", "value"]);
  const selected = () => ctx?.value?.() === local.value;
  return (
    <button
      type="button"
      {...others}
      class={cn(
        "grid min-h-8 w-full cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-left text-base outline-none hover:bg-accent data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        local.className,
        local.class,
      )}
      data-selected={selected() ? "" : undefined}
      data-slot="select-item"
      onClick={(event) => {
        local.onClick?.(event);
        ctx?.set(local.value);
        ctx?.setOpen?.(false);
      }}
    >
      <span class="col-start-1">{selected() ? <CheckIcon /> : null}</span>
      <span class="col-start-2 min-w-0">{local.children}</span>
    </button>
  );
}

export function SelectButton(props: any) {
  const [local, others] = splitProps(props, ["children", "class", "className", "size"]);
  return (
    <button
      type="button"
      class={cn(triggerBase, triggerSizes[local.size ?? "default"], "min-w-0", local.className, local.class)}
      data-slot="select-button"
      {...others}
    >
      <span class="flex-1 truncate in-data-placeholder:text-muted-foreground/72">
        {local.children}
      </span>
      <ChevronsUpDownIcon class={selectTriggerIconClassName} />
    </button>
  );
}

export function SelectSeparator(props: any) {
  return (
    <div
      class={cn("mx-2 my-1 h-px bg-border", props.className, props.class)}
      data-slot="select-separator"
      {...props}
    />
  );
}

export function SelectGroup(props: any) {
  return <div data-slot="select-group" {...props} />;
}

export function SelectLabel(props: any) {
  return (
    <div
      class={cn(
        "not-in-data-[slot=field]:mb-2 inline-flex cursor-default items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4",
        props.className,
        props.class,
      )}
      data-slot="select-label"
      {...props}
    />
  );
}

export function SelectGroupLabel(props: any) {
  return (
    <div
      class={cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", props.className, props.class)}
      data-slot="select-group-label"
      {...props}
    />
  );
}

export { SelectPopup as SelectContent };
