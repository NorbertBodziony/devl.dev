import { cn } from "../../lib/utils";

export interface CohortHeatmapRow {
  label: string;
  size: number;
  values: readonly (number | null)[];
}

export interface CohortHeatmapProps {
  averageLabel?: string;
  averageValue?: string;
  class?: string;
  rows: readonly CohortHeatmapRow[];
}

export function CohortHeatmap(props: CohortHeatmapProps) {
  const months = () =>
    Math.max(...props.rows.map((row) => row.values.length), 0);

  return (
    <div
      class={cn(
        "t-chart-entry overflow-x-auto rounded-xl border border-border/60 bg-background/40 p-5",
        props.class,
      )}
    >
      <table class="min-w-[760px] w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th class="px-2 py-1 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Cohort
            </th>
            <th class="px-2 py-1 text-right font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Size
            </th>
            {Array.from({ length: months() }).map((_, index) => (
              <th class="w-12 px-1 py-1 text-center font-mono text-[10px] text-muted-foreground">
                M{index}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, rowIndex) => (
            <tr>
              <td class="whitespace-nowrap px-2 py-1 text-muted-foreground">
                {row.label}
              </td>
              <td class="px-2 py-1 text-right font-mono text-muted-foreground">
                {row.size}
              </td>
              {Array.from({ length: months() }).map((_, index) => {
                const value = row.values[index] ?? null;
                return (
                  <td class="p-0.5">
                    {value === null ? (
                      <div class="h-7 w-full rounded bg-background" />
                    ) : (
                      <HeatmapCell
                        entryIndex={rowIndex * months() + index}
                        highlight={index === 0}
                        value={value}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div class="mt-5 flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        <span>Less</span>
        <div class="flex h-3 overflow-hidden rounded">
          {[10, 30, 50, 70, 90].map((value) => (
            <Swatch value={value} />
          ))}
        </div>
        <span>More</span>
        {props.averageLabel ? (
          <span class="ml-auto">
            {props.averageLabel}{" "}
            {props.averageValue ? (
              <span class="text-foreground">{props.averageValue}</span>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function HeatmapCell(props: {
  entryIndex: number;
  highlight?: boolean;
  value: number;
}) {
  const intensity = () => props.value / 100;

  return (
    <div
      class={cn(
        "t-chart-entry-item grid h-7 place-items-center rounded font-mono text-[10px] transition-transform hover:scale-[1.04]",
        props.highlight ? "ring-1 ring-foreground/20" : "",
      )}
      style={{
        "--chart-entry-index": String(props.entryIndex),
        "background-color": `rgba(99, 102, 241, ${0.12 + intensity() * 0.78})`,
        color: intensity() > 0.55 ? "white" : "rgb(67 56 202)",
      }}
    >
      {props.value.toFixed(0)}
    </div>
  );
}

function Swatch(props: { value: number }) {
  return (
    <span
      class="h-3 w-6"
      style={{
        "background-color": `rgba(99, 102, 241, ${
          0.12 + (props.value / 100) * 0.78
        })`,
      }}
    />
  );
}
