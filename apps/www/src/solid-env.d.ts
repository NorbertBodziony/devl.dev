// @ts-nocheck
import type { Component, JSX } from "solid-js";

declare global {
  type ComponentType<P = Record<string, never>> = Component<P>;
  type CSSProperties = JSX.CSSProperties;
  type FormEvent<T = Element> = Event & { currentTarget: T; target: Element };

  namespace JSX {
    interface HTMLAttributes<T> {
      className?: string;
    }

    interface SVGAttributes<T> {
      className?: string;
    }
  }
}
