import { Primitive, type PrimitiveProps } from "./_primitive";

export type CardProps = PrimitiveProps;

export function Card(props: CardProps) {
  return (
    <Primitive
      base="rounded-lg border bg-card text-card-foreground shadow-xs"
      {...props}
    />
  );
}

export function CardHeader(props: CardProps) {
  return <Primitive base="flex flex-col gap-1.5 p-6" {...props} />;
}

export function CardTitle(props: PrimitiveProps<"h3">) {
  return (
    <Primitive
      as="h3"
      base="font-semibold leading-none tracking-tight"
      {...props}
    />
  );
}

export function CardDescription(props: PrimitiveProps<"p">) {
  return (
    <Primitive as="p" base="text-muted-foreground text-sm" {...props} />
  );
}

export function CardContent(props: CardProps) {
  return <Primitive base="p-6 pt-0" {...props} />;
}

export function CardFooter(props: CardProps) {
  return <Primitive base="flex items-center p-6 pt-0" {...props} />;
}

export function CardPanel(props: CardProps) {
  return <Primitive base="p-6" {...props} />;
}
