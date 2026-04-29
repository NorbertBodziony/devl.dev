import { onCleanup, onMount } from "solid-js";
import { Chart } from "chart.js/auto";
import type { ChartConfiguration, Chart as ChartInstance, ChartType } from "chart.js";

export function createChart<TType extends ChartType, TData, TLabel>(
  getCanvas: () => HTMLCanvasElement,
  createConfig: () => ChartConfiguration<TType, TData, TLabel>,
  onRecreate?: (chart: ChartInstance<TType, TData, TLabel>) => void,
) {
  let chart: ChartInstance<TType, TData, TLabel> | undefined;
  let hasMounted = false;
  let observer: MutationObserver | undefined;
  const nextConfig = () => {
    const config = createConfig();

    if (hasMounted) {
      config.options = {
        ...(config.options ?? {}),
        animation: false,
      } as ChartConfiguration<TType, TData, TLabel>["options"];
    }

    return config;
  };

  onMount(() => {
    chart = new Chart(getCanvas(), nextConfig());
    hasMounted = true;
    onRecreate?.(chart);

    observer = new MutationObserver(() => {
      chart?.destroy();
      chart = new Chart(getCanvas(), nextConfig());
      onRecreate?.(chart);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  });

  onCleanup(() => {
    observer?.disconnect();
    chart?.destroy();
  });

  return () => chart;
}
