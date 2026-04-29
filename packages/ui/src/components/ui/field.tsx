import { splitProps } from "solid-js";
import { cn } from "../../lib/utils";
import { Primitive, type PrimitiveProps } from "./_primitive";

export function Field(props: PrimitiveProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      base={cn("flex flex-col items-start gap-2", local.className, local.class)}
      data-slot="field"
      {...others}
    />
  );
}

export interface FieldLabelProps extends PrimitiveProps<"label"> {
  htmlFor?: string;
}

export function FieldLabel(props: FieldLabelProps) {
  const [local, others] = splitProps(props, ["class", "className", "htmlFor"]);

  return (
    <Primitive
      as="label"
      base={cn(
        "inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground data-disabled:opacity-64 sm:text-sm/4",
        local.className,
        local.class,
      )}
      data-slot="field-label"
      for={local.htmlFor}
      {...others}
    />
  );
}

export function FieldItem(props: PrimitiveProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      base={cn("flex", local.className, local.class)}
      data-slot="field-item"
      {...others}
    />
  );
}

export function FieldDescription(props: PrimitiveProps<"p">) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      as="p"
      base={cn("text-muted-foreground text-xs", local.className, local.class)}
      data-slot="field-description"
      {...others}
    />
  );
}

export function FieldError(props: PrimitiveProps<"p">) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <Primitive
      as="p"
      base={cn("text-destructive-foreground text-xs", local.className, local.class)}
      data-slot="field-error"
      {...others}
    />
  );
}
