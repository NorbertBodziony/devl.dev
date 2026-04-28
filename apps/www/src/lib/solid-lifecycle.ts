import { createEffect, onCleanup } from "solid-js";

export function createCleanupEffect(effect: () => void | (() => void)): void {
  createEffect(() => {
    const cleanup = effect();
    if (typeof cleanup === "function") onCleanup(cleanup);
  });
}

export type MutableRef<T> = ((value: T) => void) & { current: T };

export function createMutableRef<T>(initial: T): MutableRef<T> {
  const ref = ((value: T) => {
    ref.current = value;
  }) as MutableRef<T>;
  ref.current = initial;
  return ref;
}

export function createCallback<T extends (...args: any[]) => any>(callback: T): T {
  return callback;
}
