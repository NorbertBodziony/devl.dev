// @ts-nocheck
import { cn } from "../../lib/utils"; export function Progress(props:any){ const value=Number(props.value ?? 0); return <div {...props} class={cn("h-2 w-full overflow-hidden rounded-full bg-muted", props.className, props.class)}><div class="h-full bg-primary transition-all" style={{width: value + "%"}} /></div>; }
