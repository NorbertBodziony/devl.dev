// @ts-nocheck
import { createMemo, splitProps } from "solid-js";
import { cn } from "../../lib/utils";

function asValues(value: unknown, fallback: number): number[] {
  if (Array.isArray(value)) return value.map(Number);
  if (value !== undefined) return [Number(value)];
  return [fallback];
}

function pct(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

export function Slider(props: any) {
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "defaultValue",
    "disabled",
    "max",
    "min",
    "onValueChange",
    "step",
    "value",
  ]);
  const min = () => Number(local.min ?? 0);
  const max = () => Number(local.max ?? 100);
  const step = () => Number(local.step ?? 1);
  const values = createMemo(() =>
    asValues(local.value ?? local.defaultValue, min()).sort((a, b) => a - b),
  );
  const isRange = () => values().length > 1;
  const low = () => values()[0] ?? min();
  const high = () => values()[1] ?? low();
  const startPct = () => pct(low(), min(), max());
  const endPct = () => pct(isRange() ? high() : low(), min(), max());

  const emit = (next: number[]) => {
    local.onValueChange?.(isRange() ? next : [next[0] ?? min()]);
  };

  return (
    <div
      class={cn(
        "data-[orientation=horizontal]:w-full",
        local.className,
        local.class,
      )}
      data-orientation="horizontal"
      data-slot="slider"
      {...others}
    >
      <div
        class="relative flex h-5 touch-none select-none items-center data-disabled:pointer-events-none data-disabled:opacity-64 sm:h-4"
        data-disabled={local.disabled ? "" : undefined}
        data-orientation="horizontal"
        data-slot="slider-control"
      >
        <div
          class="relative h-1 w-full grow select-none rounded-full bg-input"
          data-orientation="horizontal"
          data-slot="slider-track"
        >
          <div
            class="absolute h-full select-none rounded-full bg-primary"
            data-orientation="horizontal"
            data-slot="slider-indicator"
            style={{
              left: `${isRange() ? startPct() : 0}%`,
              right: `${100 - endPct()}%`,
            }}
          />
          <span
            class="absolute top-1/2 block size-5 shrink-0 -translate-x-1/2 -translate-y-1/2 select-none rounded-full border border-input bg-white not-dark:bg-clip-padding shadow-xs/5 outline-none before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] sm:size-4 dark:border-background"
            data-slot="slider-thumb"
            style={{ left: `${startPct()}%` }}
          />
          {isRange() ? (
            <span
              class="absolute top-1/2 block size-5 shrink-0 -translate-x-1/2 -translate-y-1/2 select-none rounded-full border border-input bg-white not-dark:bg-clip-padding shadow-xs/5 outline-none before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] sm:size-4 dark:border-background"
              data-slot="slider-thumb"
              style={{ left: `${endPct()}%` }}
            />
          ) : null}
        </div>
        <input
          aria-hidden="true"
          disabled={local.disabled}
          min={min()}
          max={max()}
          step={step()}
          type="range"
          value={low()}
          class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          onInput={(event) => {
            const next = Number(event.currentTarget.value);
            emit(isRange() ? [Math.min(next, high()), high()] : [next]);
          }}
        />
        {isRange() ? (
          <input
            aria-hidden="true"
            disabled={local.disabled}
            min={min()}
            max={max()}
            step={step()}
            type="range"
            value={high()}
            class="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
            onInput={(event) => {
              const next = Number(event.currentTarget.value);
              emit([low(), Math.max(next, low())]);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export function SliderValue(props: any) {
  const [local, others] = splitProps(props, ["class", "className"]);
  return (
    <span
      class={cn("flex justify-end text-sm", local.className, local.class)}
      data-slot="slider-value"
      {...others}
    />
  );
}
