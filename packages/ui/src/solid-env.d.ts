// @ts-nocheck
import type { Component, JSX } from "solid-js";

declare global {
  type ComponentType<P = Record<string, never>> = Component<P>;
  type CSSProperties = JSX.CSSProperties;
  type ComponentProps<T extends keyof JSX.IntrinsicElements | Component<any>> =
    T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : T extends Component<infer P>
        ? P
        : never;
  type ComponentPropsWithoutRef<T extends keyof JSX.IntrinsicElements> =
    JSX.IntrinsicElements[T];

  namespace JSX {
    interface HTMLAttributes<T> {
      className?: string;
    }

    interface SVGAttributes<T> {
      className?: string;
    }
  }
}
