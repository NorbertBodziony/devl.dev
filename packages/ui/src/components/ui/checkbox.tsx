// @ts-nocheck
import { createEffect, createMemo, createSignal, splitProps } from "solid-js";
import { cn } from "../../lib/utils";
import { useCheckboxGroup } from "./checkbox-group";

export function Checkbox(props: any) {
  const group = useCheckboxGroup();
  const [local, others] = splitProps(props, ["class", "className", "checked", "defaultChecked", "onCheckedChange", "onClick", "value", "children"]);
  const grouped = createMemo(() => group && local.value !== undefined);
  const [checked, setChecked] = createSignal(Boolean(local.checked ?? local.defaultChecked ?? (grouped() ? group.isChecked(String(local.value)) : false)));

  createEffect(() => {
    if (local.checked !== undefined) {
      setChecked(Boolean(local.checked));
    } else if (grouped()) {
      setChecked(group.isChecked(String(local.value)));
    }
  });

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked()}
      value={local.value}
      {...others}
      class={cn("inline-flex size-4 shrink-0 items-center justify-center rounded border border-input bg-background text-primary transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", local.className, local.class)}
      data-state={checked() ? "checked" : "unchecked"}
      onClick={(event) => {
        local.onClick?.(event);
        const next = !checked();
        if (grouped()) {
          group.setItem(String(local.value), next);
        } else {
          setChecked(next);
        }
        local.onCheckedChange?.(next);
      }}
    >
      {local.children ?? (checked() ? "✓" : null)}
    </button>
  );
}
