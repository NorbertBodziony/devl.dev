import { splitProps, type ComponentProps } from "solid-js";
import { cn } from "../../lib/utils";
import type { ClassProps } from "./_primitive";

type InputSize = "default" | "sm" | "lg";
type InputEventLike = InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

export interface InputProps
  extends Omit<
      ComponentProps<"input">,
      "class" | "onChange" | "onInput" | "size"
    >,
    ClassProps {
  nativeInput?: boolean;
  onChange?: (event: InputEventLike) => void;
  onInput?: (event: InputEventLike) => void;
  size?: InputSize;
  unstyled?: boolean;
}

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "className",
    "nativeInput",
    "onChange",
    "onInput",
    "size",
    "unstyled",
  ]);
  const size = () => local.size ?? "default";
  const inputClassName = () =>
    cn(
      "box-border h-9 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] py-0 leading-9 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 sm:h-8 sm:leading-8",
      size() === "sm" &&
        "h-8 px-[calc(--spacing(2.5)-1px)] leading-8 sm:h-7 sm:leading-7",
      size() === "lg" && "h-10 leading-10 sm:h-9 sm:leading-9",
      rest.type === "search" &&
        "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
      rest.type === "file" &&
        "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
    );

  return (
    <span
      class={cn(
        !local.unstyled &&
          "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        local.className,
        local.class,
      )}
      data-size={size()}
      data-slot="input-control"
    >
      <input
        {...rest}
        onInput={(event) => {
          local.onInput?.(event as InputEventLike);
          local.onChange?.(event as InputEventLike);
        }}
        onChange={(event) => local.onChange?.(event as InputEventLike)}
        class={inputClassName()}
        data-slot="input"
      />
    </span>
  );
}
