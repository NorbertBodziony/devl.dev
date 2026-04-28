// @ts-nocheck
import { OverlayPanel, OverlayRoot, OverlayTrigger } from "./_primitive"; export const Popover=OverlayRoot; export const PopoverTrigger=OverlayTrigger; export const PopoverPopup=(p:any)=><OverlayPanel base="z-50 rounded-md border bg-popover p-2 text-popover-foreground shadow-md" {...p}/>; export const PopoverContent=PopoverPopup;
