// @ts-nocheck
import { OverlayPanel, OverlayRoot, OverlayTrigger } from "./_primitive"; export const Tooltip=OverlayRoot; export const TooltipTrigger=OverlayTrigger; export const TooltipPopup=(p:any)=><OverlayPanel base="rounded-md bg-foreground px-2 py-1 text-background text-xs" {...p}/>;
