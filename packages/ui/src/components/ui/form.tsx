import { splitProps, type ComponentProps, type ParentProps } from "solid-js";
import { Primitive, type ClassProps, type PrimitiveProps } from "./_primitive";
import { cn } from "../../lib/utils";

export type FormProps = ParentProps<Omit<ComponentProps<"form">, "class">> &
  ClassProps;

export function Form(props: FormProps) {
  const [local, others] = splitProps(props, ["class", "className"]);

  return (
    <form
      class={cn(local.className, local.class)}
      data-slot="form"
      {...others}
    />
  );
}

export function FormField(props: PrimitiveProps) {
  return <Primitive data-slot="form-field" {...props} />;
}

export function FormLabel(props: PrimitiveProps<"label">) {
  return <Primitive as="label" data-slot="form-label" {...props} />;
}

export function FormControl(props: PrimitiveProps) {
  return <Primitive data-slot="form-control" {...props} />;
}

export function FormDescription(props: PrimitiveProps<"p">) {
  return <Primitive as="p" data-slot="form-description" {...props} />;
}

export function FormMessage(props: PrimitiveProps<"p">) {
  return <Primitive as="p" data-slot="form-message" {...props} />;
}
