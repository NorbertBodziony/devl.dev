// @ts-nocheck
import { cn } from "../../lib/utils";
export function Textarea(props:any){
  const { className, class: classProp, onInput, onChange, ...rest } = props;
  return <textarea {...rest} onInput={(event) => {
    onInput?.(event);
    onChange?.(event);
  }} onChange={onChange} class={cn("flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className, classProp)} />;
}
