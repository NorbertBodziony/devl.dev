// @ts-nocheck
import { cn } from "../../lib/utils";
export function Separator(props:any){ return <div role="separator" aria-orientation={props.orientation || "horizontal"} {...props} class={cn(props.orientation === "vertical" ? "h-full w-px bg-border" : "h-px w-full bg-border", props.className, props.class)} />; }
