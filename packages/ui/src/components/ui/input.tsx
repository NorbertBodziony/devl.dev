// @ts-nocheck
import { cn } from "../../lib/utils";
export function Input(props:any){
  const { className, class: classProp, onInput, onChange, ...rest } = props;
  return <input {...rest} onInput={(event) => {
    onInput?.(event);
    onChange?.(event);
  }} onChange={onChange} class={cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className, classProp)} />;
}
