export function formatNumber(value: number) {
  return value.toLocaleString();
}

export function formatSignedNumber(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}
