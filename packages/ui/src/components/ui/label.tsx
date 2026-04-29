import { splitProps } from "solid-js";
import { Primitive, type PrimitiveProps } from "./_primitive";

export interface LabelProps extends PrimitiveProps<"label"> {
  htmlFor?: string;
}

export function Label(props: LabelProps) {
  const [local, others] = splitProps(props, ["htmlFor"]);

  return (
    <Primitive
      as="label"
      base="inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4"
      data-slot="label"
      for={local.htmlFor}
      {...others}
    />
  );
}
