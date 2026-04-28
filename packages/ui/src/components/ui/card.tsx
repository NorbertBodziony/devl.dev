// @ts-nocheck
import { Primitive } from "./_primitive";
export const Card = (p:any)=><Primitive base="rounded-lg border bg-card text-card-foreground shadow-xs" {...p}/>;
export const CardHeader = (p:any)=><Primitive base="flex flex-col gap-1.5 p-6" {...p}/>;
export const CardTitle = (p:any)=><Primitive as="h3" base="font-semibold leading-none tracking-tight" {...p}/>;
export const CardDescription = (p:any)=><Primitive as="p" base="text-muted-foreground text-sm" {...p}/>;
export const CardContent = (p:any)=><Primitive base="p-6 pt-0" {...p}/>;
export const CardFooter = (p:any)=><Primitive base="flex items-center p-6 pt-0" {...p}/>;
export const CardPanel = (p:any)=><Primitive base="p-6" {...p}/>;
