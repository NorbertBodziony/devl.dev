// @ts-nocheck
import type { Component, JSX } from "solid-js";

declare global {
  type ComponentType<P = Record<string, never>> = Component<P>;
  type CSSProperties = JSX.CSSProperties;
  type FormEvent<T = Element> = React.FormEvent<T>;

  namespace React {
    type ReactNode = JSX.Element;
    type ReactElement = JSX.Element;
    type ComponentType<P = Record<string, never>> = Component<P>;
    type CSSProperties = JSX.CSSProperties;
    type FormEvent<T = Element> = Event & { currentTarget: T; target: Element };
    type MouseEvent<T = Element> = globalThis.MouseEvent & { currentTarget: T };
    type KeyboardEvent<T = Element> = globalThis.KeyboardEvent & { currentTarget: T };
    type PointerEvent<T = Element> = globalThis.PointerEvent & { currentTarget: T };
    type ButtonHTMLAttributes<T = HTMLButtonElement> = JSX.ButtonHTMLAttributes<T>;
    type SelectHTMLAttributes<T = HTMLSelectElement> = JSX.SelectHTMLAttributes<T>;
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
