// @ts-nocheck
import type { Component, JSX } from "solid-js";

declare global {
  namespace React {
    type ReactNode = JSX.Element;
    type ReactElement = JSX.Element;
    type ComponentType<P = Record<string, never>> = Component<P>;
    type CSSProperties = JSX.CSSProperties;
    type Ref<T> = ((value: T) => void) | { current?: T } | undefined;
    type RefAttributes<T> = { ref?: Ref<T> };
    type ComponentProps<T extends keyof JSX.IntrinsicElements | Component<any>> =
      T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : T extends Component<infer P>
          ? P
          : never;
    type ComponentPropsWithoutRef<T extends keyof JSX.IntrinsicElements> =
      JSX.IntrinsicElements[T];
    type ButtonHTMLAttributes<T = HTMLButtonElement> = JSX.ButtonHTMLAttributes<T>;
    type MouseEvent<T = Element> = globalThis.MouseEvent & { currentTarget: T };
  }

  namespace JSX {
    interface HTMLAttributes<T> {
      className?: string;
    }

    interface SVGAttributes<T> {
      className?: string;
    }
  }
}

