import { Primitive, type PrimitiveProps } from "./_primitive";

export type CardProps = PrimitiveProps;

export function Card(props: CardProps) {
  return (
    <Primitive
      base="relative flex flex-col rounded-2xl border bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
      data-slot="card"
      {...props}
    />
  );
}

export function CardFrame(props: CardProps) {
  return (
    <Primitive
      base="relative flex flex-col rounded-2xl border bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5 [--clip-bottom:-1rem] [--clip-top:-1rem] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:bg-muted/72 before:shadow-[0_1px_--theme(--color-black/4%)] has-data-[slot=table-container]:overflow-hidden *:data-[slot=card]:-m-px *:data-[slot=table-container]:-m-px *:data-[slot=table-container]:w-[calc(100%+2px)] *:not-first:data-[slot=card]:rounded-t-xl *:not-last:data-[slot=card]:rounded-b-xl *:data-[slot=card]:bg-clip-padding *:data-[slot=card]:shadow-none *:data-[slot=card]:before:hidden *:not-first:data-[slot=card]:before:rounded-t-[calc(var(--radius-xl)-1px)] *:not-last:data-[slot=card]:before:rounded-b-[calc(var(--radius-xl)-1px)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] *:data-[slot=card]:[clip-path:inset(var(--clip-top)_1px_var(--clip-bottom)_1px_round_calc(var(--radius-2xl)-1px))] *:data-[slot=card]:last:[--clip-bottom:1px] *:data-[slot=card]:first:[--clip-top:1px]"
      data-slot="card-frame"
      {...props}
    />
  );
}

export function CardFrameHeader(props: CardProps) {
  return (
    <Primitive
      base="relative flex grid auto-rows-min grid-rows-[auto_auto] flex-col items-start gap-x-4 px-6 py-4 has-data-[slot=card-frame-action]:grid-cols-[1fr_auto]"
      data-slot="card-frame-header"
      {...props}
    />
  );
}

export function CardFrameTitle(props: CardProps) {
  return (
    <Primitive
      base="self-center font-semibold text-sm"
      data-slot="card-frame-title"
      {...props}
    />
  );
}

export function CardFrameDescription(props: CardProps) {
  return (
    <Primitive
      base="self-center text-muted-foreground text-sm"
      data-slot="card-frame-description"
      {...props}
    />
  );
}

export function CardFrameAction(props: CardProps) {
  return (
    <Primitive
      base="col-start-2 nth-3:row-span-2 nth-3:row-start-1 inline-flex self-center justify-self-end"
      data-slot="card-frame-action"
      {...props}
    />
  );
}

export function CardFrameFooter(props: CardProps) {
  return (
    <Primitive base="px-6 py-4" data-slot="card-frame-footer" {...props} />
  );
}

export function CardHeader(props: CardProps) {
  return (
    <Primitive
      base="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-6 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pb-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]"
      data-slot="card-header"
      {...props}
    />
  );
}

export function CardTitle(props: CardProps) {
  return (
    <Primitive
      base="font-semibold text-lg leading-none"
      data-slot="card-title"
      {...props}
    />
  );
}

export function CardDescription(props: CardProps) {
  return (
    <Primitive
      base="text-muted-foreground text-sm"
      data-slot="card-description"
      {...props}
    />
  );
}

export function CardAction(props: CardProps) {
  return (
    <Primitive
      base="col-start-2 row-span-2 row-start-1 inline-flex self-start justify-self-end"
      data-slot="card-action"
      {...props}
    />
  );
}

export function CardPanel(props: CardProps) {
  return (
    <Primitive
      base="flex-1 p-6 in-[[data-slot=card]:has(>[data-slot=card-header]:not(.border-b))]:pt-0 in-[[data-slot=card]:has(>[data-slot=card-footer]:not(.border-t))]:pb-0"
      data-slot="card-panel"
      {...props}
    />
  );
}

export function CardFooter(props: CardProps) {
  return (
    <Primitive
      base="flex items-center p-6 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-4"
      data-slot="card-footer"
      {...props}
    />
  );
}

export { CardPanel as CardContent };
