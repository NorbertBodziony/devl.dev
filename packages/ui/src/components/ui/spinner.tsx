// @ts-nocheck
import { cn } from "../../lib/utils";
export function Spinner(props: any) { return <span {...props} class={cn("inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent", props.className, props.class)} />; }
