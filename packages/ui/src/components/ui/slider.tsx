// @ts-nocheck
import { cn } from "../../lib/utils";
export function Slider(props:any){ const value=Array.isArray(props.value)?props.value[0]:Array.isArray(props.defaultValue)?props.defaultValue[0]:(props.value ?? props.defaultValue ?? 0); return <input type="range" {...props} value={value} min={props.min ?? 0} max={props.max ?? 100} class={cn("w-full accent-primary", props.className, props.class)} onInput={(e)=>props.onValueChange?.([Number(e.currentTarget.value)])}/>; }
