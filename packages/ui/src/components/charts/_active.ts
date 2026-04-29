import type {
  ActiveDataPoint,
  Chart as ChartInstance,
  ChartType,
} from "chart.js";

export function syncChartActiveElements<TType extends ChartType>(
  chart: ChartInstance<TType>,
  activeElements: readonly ActiveDataPoint[],
) {
  chart.setActiveElements([...activeElements]);

  const first = activeElements[0];
  if (!first) {
    chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
    chart.update();
    return;
  }

  const element = chart.getDatasetMeta(first.datasetIndex).data[first.index];
  const position = element?.tooltipPosition(true) ?? {
    x: chart.chartArea.left + chart.chartArea.width / 2,
    y: chart.chartArea.top + chart.chartArea.height / 2,
  };

  chart.tooltip?.setActiveElements([...activeElements], position);
  chart.update();
}

export function lastNumericIndex(values: readonly unknown[]) {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (typeof values[index] === "number") return index;
  }
  return -1;
}
