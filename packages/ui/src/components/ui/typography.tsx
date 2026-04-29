import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type ComponentProps, type ParentProps } from "solid-js";
import { Primitive, type ClassProps, type PrimitiveAs } from "./_primitive";
import { cn } from "../../lib/utils";

export const headingVariants = cva("font-heading tracking-tight", {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      display: "text-4xl leading-tight md:text-5xl",
      lg: "text-2xl",
      md: "text-xl",
      sm: "text-lg",
      xl: "text-3xl",
    },
  },
});

export const textVariants = cva("", {
  defaultVariants: {
    leading: "normal",
    size: "base",
    tone: "default",
  },
  variants: {
    leading: {
      normal: "",
      relaxed: "leading-relaxed",
      tight: "leading-tight",
    },
    size: {
      base: "text-base",
      sm: "text-sm",
      xs: "text-xs",
    },
    tone: {
      danger: "text-destructive",
      default: "text-foreground",
      muted: "text-muted-foreground",
      subtle: "text-muted-foreground/70",
      success: "text-success-foreground",
    },
  },
});

export const eyebrowVariants = cva(
  "font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]",
);

export const captionVariants = cva(
  "font-mono text-[10px] text-muted-foreground",
);

export interface HeadingProps
  extends ParentProps<Omit<ComponentProps<"h2">, "class">>,
    ClassProps,
    VariantProps<typeof headingVariants> {
  as?: Extract<PrimitiveAs, "h1" | "h2" | "h3" | "h4">;
}

export function Heading(props: HeadingProps) {
  const [local, others] = splitProps(props, [
    "as",
    "class",
    "className",
    "size",
  ]);

  return (
    <Primitive
      as={local.as ?? "h2"}
      base={cn(headingVariants({ size: local.size ?? "md" }), local.className, local.class)}
      {...others}
    />
  );
}

export interface TextProps
  extends ParentProps<Omit<ComponentProps<"p">, "class">>,
    ClassProps,
    VariantProps<typeof textVariants> {
  as?: Extract<PrimitiveAs, "div" | "p" | "span">;
}

export function Text(props: TextProps) {
  const [local, others] = splitProps(props, [
    "as",
    "class",
    "className",
    "leading",
    "size",
    "tone",
  ]);

  return (
    <Primitive
      as={local.as ?? "p"}
      base={cn(
        textVariants({
          leading: local.leading ?? "normal",
          size: local.size ?? "base",
          tone: local.tone ?? "default",
        }),
        local.className,
        local.class,
      )}
      {...others}
    />
  );
}

export interface EyebrowProps
  extends ParentProps<Omit<ComponentProps<"div">, "class">>,
    ClassProps {
  as?: Extract<PrimitiveAs, "div" | "p" | "span">;
}

export function Eyebrow(props: EyebrowProps) {
  const [local, others] = splitProps(props, ["as", "class", "className"]);

  return (
    <Primitive
      as={local.as ?? "div"}
      base={cn(eyebrowVariants(), local.className, local.class)}
      {...others}
    />
  );
}

export interface CaptionProps
  extends ParentProps<Omit<ComponentProps<"span">, "class">>,
    ClassProps {
  as?: Extract<PrimitiveAs, "div" | "p" | "span">;
}

export function Caption(props: CaptionProps) {
  const [local, others] = splitProps(props, ["as", "class", "className"]);

  return (
    <Primitive
      as={local.as ?? "span"}
      base={cn(captionVariants(), local.className, local.class)}
      {...others}
    />
  );
}
