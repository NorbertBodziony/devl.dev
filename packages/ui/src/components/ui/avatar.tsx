// @ts-nocheck
import { Primitive } from "./_primitive";
export const Avatar=(p:any)=><Primitive base="relative flex size-10 shrink-0 overflow-hidden rounded-full" {...p}/>; export const AvatarImage=(p:any)=><img {...p} class={p.class || p.className || "aspect-square size-full"}/>; export const AvatarFallback=(p:any)=><Primitive base="flex size-full items-center justify-center rounded-full bg-muted" {...p}/>;
