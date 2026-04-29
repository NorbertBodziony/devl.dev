// @ts-nocheck
import { createEffect, createSignal, splitProps } from "solid-js";
import { cn } from "../../lib/utils";

export function Switch(props: any) {
  const [local, others] = splitProps(props, [
    "checked",
    "class",
    "className",
    "defaultChecked",
    "disabled",
    "onCheckedChange",
    "onClick",
  ]);
  const [checked, setChecked] = createSignal(
    Boolean(local.checked ?? local.defaultChecked),
  );

  createEffect(() => {
    if (local.checked !== undefined) setChecked(Boolean(local.checked));
  });

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked()}
      disabled={local.disabled}
      class={cn(
        "inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px outline-none transition-[background-color,box-shadow] duration-200 [--thumb-size:--spacing(5)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-disabled:cursor-not-allowed data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-64 sm:[--thumb-size:--spacing(4)]",
        local.className,
        local.class,
      )}
      data-checked={checked() ? "" : undefined}
      data-disabled={local.disabled ? "" : undefined}
      data-slot="switch"
      data-state={checked() ? "checked" : "unchecked"}
      data-unchecked={!checked() ? "" : undefined}
      onClick={(event) => {
        local.onClick?.(event);
        if (event.defaultPrevented || local.disabled) return;
        const next = !checked();
        setChecked(next);
        local.onCheckedChange?.(next);
      }}
      {...others}
    >
      <span
        class="pointer-events-none block aspect-square h-full origin-left rounded-(--thumb-size) bg-background shadow-sm/5 will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s] data-checked:origin-[var(--thumb-size)_50%] data-checked:translate-x-[calc(var(--thumb-size)-4px)]"
        data-checked={checked() ? "" : undefined}
        data-slot="switch-thumb"
        data-state={checked() ? "checked" : "unchecked"}
        data-unchecked={!checked() ? "" : undefined}
      />
    </button>
  );
}
