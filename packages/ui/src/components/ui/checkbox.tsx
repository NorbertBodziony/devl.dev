// @ts-nocheck
import { createEffect, createMemo, createSignal, splitProps } from "solid-js";
import { cn } from "../../lib/utils";
import { useCheckboxGroup } from "./checkbox-group";

export function Checkbox(props: any) {
  const group = useCheckboxGroup();
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "checked",
    "defaultChecked",
    "disabled",
    "onCheckedChange",
    "onClick",
    "value",
    "children",
  ]);
  const grouped = createMemo(() => group && local.value !== undefined);
  const [checked, setChecked] = createSignal(
    local.checked ?? local.defaultChecked ?? (grouped() ? group.isChecked(String(local.value)) : false),
  );
  const isChecked = createMemo(() => checked() === true);
  const isIndeterminate = createMemo(() => checked() === "indeterminate");
  const state = createMemo(() => isChecked() || isIndeterminate() ? "checked" : "unchecked");

  createEffect(() => {
    if (local.checked !== undefined) {
      setChecked(local.checked);
    } else if (grouped()) {
      setChecked(group.isChecked(String(local.value)));
    }
  });

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isIndeterminate() ? "mixed" : isChecked()}
      value={local.value}
      {...others}
      class={cn(
        "relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-[.25rem] border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 outline-none ring-ring transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[3px] not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/48 data-disabled:cursor-not-allowed data-disabled:opacity-64 sm:size-4 dark:not-data-checked:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [[data-disabled],[data-checked],[aria-invalid]]:shadow-none",
        local.className,
        local.class,
      )}
      data-checked={state() === "checked" ? "" : undefined}
      data-disabled={local.disabled ? "" : undefined}
      data-slot="checkbox"
      data-state={state()}
      data-unchecked={state() === "unchecked" ? "" : undefined}
      disabled={local.disabled}
      onClick={(event) => {
        local.onClick?.(event);
        if (event.defaultPrevented || local.disabled) return;
        const next = !isChecked();
        if (grouped()) {
          group.setItem(String(local.value), next);
        } else {
          setChecked(next);
        }
        local.onCheckedChange?.(next);
      }}
    >
      <span
        class="absolute -inset-px flex items-center justify-center rounded-[.25rem] text-primary-foreground data-unchecked:hidden data-checked:bg-primary data-indeterminate:text-foreground"
        data-checked={state() === "checked" ? "" : undefined}
        data-indeterminate={isIndeterminate() ? "" : undefined}
        data-slot="checkbox-indicator"
        data-state={state()}
        data-unchecked={state() === "unchecked" ? "" : undefined}
      >
        {local.children ?? (isIndeterminate() ? (
          <svg
            aria-hidden="true"
            class="size-3.5 sm:size-3"
            fill="none"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5.252 12h13.496" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            class="size-3.5 sm:size-3"
            fill="none"
            height="24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
          </svg>
        ))}
      </span>
    </button>
  );
}
