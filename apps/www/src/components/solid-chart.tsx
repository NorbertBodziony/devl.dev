// @ts-nocheck
import type { JSX } from "solid-js";

type ChartProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  children?: JSX.Element;
  data?: unknown[];
};

function Chart(props: ChartProps) {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      {...props}
      class={props.className || props.class || "h-full w-full"}
    >
      <g opacity="0.18">
        <path d="M20 150H300" stroke="currentColor" />
        <path d="M20 110H300" stroke="currentColor" />
        <path d="M20 70H300" stroke="currentColor" />
        <path d="M20 30H300" stroke="currentColor" />
      </g>
      {props.children}
      <path
        d="M24 136C58 112 72 118 98 84C124 50 152 74 178 58C212 38 236 86 296 42"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  );
}

export const AreaChart = Chart;
export const BarChart = Chart;
export const LineChart = Chart;
export const PieChart = Chart;
export const RadialBarChart = Chart;
export const ScatterChart = Chart;
export const ResponsiveContainer = (props: { children?: JSX.Element }) => <>{props.children}</>;
export const Area = () => null;
export const Bar = () => null;
export const Cell = () => null;
export const LabelList = () => null;
export const Legend = () => null;
export const Line = () => null;
export const Pie = () => null;
export const PolarAngleAxis = () => null;
export const RadialBar = () => null;
export const ReferenceArea = () => null;
export const ReferenceLine = () => null;
export const Scatter = () => null;
export const XAxis = () => null;
export const YAxis = () => null;
export const ZAxis = () => null;
export const CartesianGrid = () => null;
export const Tooltip = () => null;

export type TooltipValueType = string | number | Array<string | number>;
export type TooltipProps<TValue = TooltipValueType, TName = string | number> = {
  active?: boolean;
  payload?: Array<{ value?: TValue; name?: TName; color?: string; dataKey?: string }>;
  label?: string | number;
};
export type TooltipContentProps<TValue = TooltipValueType, TName = string | number> =
  TooltipProps<TValue, TName>;
