export const CHART_ENTRY_DURATION = 850;
export const CHART_ENTRY_EASING = "easeOutQuart" as const;

export function chartEntryAnimation(delay = 0) {
  return {
    delay,
    duration: CHART_ENTRY_DURATION,
    easing: CHART_ENTRY_EASING,
  };
}
