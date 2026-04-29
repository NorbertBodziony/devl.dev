import { splitProps, type ComponentProps } from "solid-js";
import { cn } from "../../lib/utils";
import type { ClassProps } from "./_primitive";

type TextareaEventLike = InputEvent & {
  currentTarget: HTMLTextAreaElement;
  target: HTMLTextAreaElement;
};

export interface TextareaProps
  extends Omit<ComponentProps<"textarea">, "class" | "onChange" | "onInput">,
    ClassProps {
  onChange?: (event: TextareaEventLike) => void;
  onInput?: (event: TextareaEventLike) => void;
}

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "className",
    "onInput",
    "onChange",
  ]);

  return (
    <textarea
      {...rest}
      onInput={(event) => {
        local.onInput?.(event as TextareaEventLike);
        local.onChange?.(event as TextareaEventLike);
      }}
      onChange={(event) => local.onChange?.(event as TextareaEventLike)}
      class={cn(
        "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        local.className,
        local.class,
      )}
    />
  );
}
