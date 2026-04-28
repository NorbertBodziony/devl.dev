// @ts-nocheck
import { createContext, createEffect, createMemo, createSignal, splitProps, useContext, type JSX, type ParentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "../../lib/utils";

export type AnyProps = ParentProps<Record<string, any> & { class?: string; className?: string }>;

export function cls(...values: any[]) { return cn(...values); }

export function Primitive(props: AnyProps & { as?: keyof JSX.IntrinsicElements; base?: string }) {
  const [local, others] = splitProps(props, ["as", "base", "class", "className", "children"]);
  return <Dynamic component={local.as || "div"} {...others} class={cn(local.base, local.className, local.class)}>{local.children}</Dynamic>;
}

export function makePrimitive(as: keyof JSX.IntrinsicElements, base = "") {
  return function Component(props: AnyProps) {
    return <Primitive as={as} base={base} {...props} />;
  };
}

export function makeButton(base = "") {
  return function ButtonLike(props: AnyProps & { loading?: boolean; size?: string; variant?: string }) {
    const [local, others] = splitProps(props, ["class", "className", "children", "loading", "size", "variant"]);
    return <button type="button" {...others} class={cn(base, local.className, local.class)} data-size={local.size} data-variant={local.variant} data-loading={local.loading ? "" : undefined}>{local.children}</button>;
  };
}

type OverlayState = { open: () => boolean; setOpen: (open: boolean) => void };
const OverlayContext = createContext<OverlayState>({ open: () => true, setOpen: () => {} });

export function OverlayRoot(props: AnyProps & { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const controlled = createMemo(() => props.open !== undefined);
  const [open, setOpenState] = createSignal(props.open ?? props.defaultOpen ?? false);
  createEffect(() => { if (controlled()) setOpenState(Boolean(props.open)); });
  const setOpen = (next: boolean) => { if (!controlled()) setOpenState(next); props.onOpenChange?.(next); };
  return <OverlayContext.Provider value={{ open, setOpen }}>{props.children}</OverlayContext.Provider>;
}

export function useOverlay() { return useContext(OverlayContext); }

export function OverlayPanel(props: AnyProps & { forceMount?: boolean; as?: keyof JSX.IntrinsicElements; base?: string }) {
  const overlay = useOverlay();
  return <>{props.forceMount || overlay.open() ? <Primitive as={props.as || "div"} base={props.base} {...props} /> : null}</>;
}

export function OverlayTrigger(props: AnyProps & { as?: keyof JSX.IntrinsicElements; render?: any }) {
  const overlay = useOverlay();
  const [local, others] = splitProps(props, ["class", "className", "children", "as", "onClick", "render"]);
  const onTriggerClick = (event: MouseEvent) => {
    local.onClick?.(event);
    overlay.setOpen(!overlay.open());
  };

  if (local.as) {
    return <Dynamic component={local.as} {...others} class={cn(local.className, local.class)} onClick={onTriggerClick}>{local.children}</Dynamic>;
  }

  return <button type="button" {...others} class={cn(local.className, local.class)} onClick={onTriggerClick}>{local.children}</button>;
}

export function maybeChecked(props: any) { return props.checked ?? props.defaultChecked ?? false; }
