// @ts-nocheck
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
  type Accessor,
  type Setter,
} from "solid-js";

export function useState<T>(initial: T | (() => T)): [Accessor<T>, Setter<T>] {
  return createSignal(untrack(() => (typeof initial === "function" ? (initial as () => T)() : initial)));
}

export function useEffect(effect: () => void | (() => void)): void {
  createEffect(() => {
    const cleanup = effect();
    if (typeof cleanup === "function") onCleanup(cleanup);
  });
}

export function useMemo<T>(factory: () => T): Accessor<T> {
  return createMemo(factory);
}

export function useCallback<T extends (...args: any[]) => any>(callback: T): T {
  return callback;
}

export function useRef<T>(initial: T): { current: T } {
  return { current: initial };
}

