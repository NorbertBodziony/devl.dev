import {
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  type ComponentProps,
  type JSX,
  type ParentProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "../../lib/utils";

export interface ClassProps {
  class?: string;
  className?: string;
}

export type PrimitiveAs = keyof JSX.IntrinsicElements;

export type PrimitiveProps<TAs extends PrimitiveAs = "div"> = ParentProps<
  ComponentProps<TAs> &
    ClassProps & {
      as?: TAs;
      base?: string;
    }
>;

export type AnyProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> & ClassProps
>;

export function cls(...values: Parameters<typeof cn>): string {
  return cn(...values);
}

export function Primitive<TAs extends PrimitiveAs = "div">(
  props: PrimitiveProps<TAs>,
) {
  const [local, others] = splitProps(props, [
    "as",
    "base",
    "class",
    "className",
    "children",
  ]);

  return (
    <Dynamic
      component={(local.as ?? "div") as PrimitiveAs}
      {...(others as unknown as ComponentProps<"div">)}
      class={cn(local.base, local.className, local.class)}
    >
      {local.children}
    </Dynamic>
  );
}

export function makePrimitive<TAs extends PrimitiveAs>(
  as: TAs,
  base = "",
) {
  return function Component(
    props: Omit<PrimitiveProps<TAs>, "as" | "base">,
  ) {
    return (
      <Primitive
        as={as}
        base={base}
        {...(props as unknown as PrimitiveProps<TAs>)}
      />
    );
  };
}

export interface ButtonLikeProps
  extends ParentProps<ComponentProps<"button">>,
    ClassProps {
  loading?: boolean;
  size?: string;
  variant?: string;
}

export function makeButton(base = "") {
  return function ButtonLike(props: ButtonLikeProps) {
    const [local, others] = splitProps(props, [
      "class",
      "className",
      "children",
      "loading",
      "size",
      "variant",
    ]);

    return (
      <button
        type="button"
        {...others}
        class={cn(base, local.className, local.class)}
        data-size={local.size}
        data-variant={local.variant}
        data-loading={local.loading ? "" : undefined}
      >
        {local.children}
      </button>
    );
  };
}

type OverlayState = {
  open: () => boolean;
  setOpen: (open: boolean) => void;
  triggerRect: () => DOMRect | null;
  setTriggerRect: (rect: DOMRect | null) => void;
};

const OverlayContext = createContext<OverlayState>({
  open: () => false,
  setOpen: () => {},
  triggerRect: () => null,
  setTriggerRect: () => {},
});

export interface OverlayRootProps extends AnyProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function OverlayRoot(props: OverlayRootProps) {
  const controlled = createMemo(() => props.open !== undefined);
  const [open, setOpenState] = createSignal(
    props.open ?? props.defaultOpen ?? false,
  );
  const [triggerRect, setTriggerRect] = createSignal<DOMRect | null>(null);

  createEffect(() => {
    if (controlled()) setOpenState(Boolean(props.open));
  });

  const setOpen = (next: boolean) => {
    if (!controlled()) setOpenState(next);
    props.onOpenChange?.(next);
  };

  return (
    <OverlayContext.Provider value={{ open, setOpen, triggerRect, setTriggerRect }}>
      <span data-overlay-root="" class="contents">
        {props.children}
      </span>
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}

export interface OverlayPanelProps extends PrimitiveProps {
  align?: "start" | "center" | "end";
  forceMount?: boolean;
  side?: "top" | "bottom";
  sideOffset?: number;
}

export function OverlayPanel(props: OverlayPanelProps) {
  const overlay = useOverlay();
  const [local, others] = splitProps(props, [
    "align",
    "forceMount",
    "side",
    "sideOffset",
    "style",
  ]);
  const rect = () => overlay.triggerRect();
  const placementStyle = () => {
    const r = rect();
    if (!r) return {};
    const side = local.side ?? "bottom";
    const align = local.align ?? "center";
    const sideOffset = local.sideOffset ?? 4;
    const style: Record<string, string> = {
      position: "fixed",
      top: `${side === "top" ? r.top - sideOffset : r.bottom + sideOffset}px`,
    };
    if (align === "end") {
      style.right = `${Math.max(0, window.innerWidth - r.right)}px`;
    } else if (align === "start") {
      style.left = `${r.left}px`;
    } else {
      style.left = `${r.left + r.width / 2}px`;
      style.transform = "translateX(-50%)";
    }
    return style;
  };

  return (
    <Show when={local.forceMount || overlay.open()}>
      <Primitive
        as={props.as ?? "div"}
        base={props.base}
        data-overlay-panel=""
        {...others}
        style={{
          ...placementStyle(),
          ...(typeof local.style === "object" && local.style !== null
            ? local.style
            : {}),
          display: local.forceMount && !overlay.open() ? "none" : undefined,
        }}
      />
    </Show>
  );
}

export interface OverlayTriggerProps extends AnyProps {
  as?: PrimitiveAs;
  onClick?: (event: MouseEvent) => void;
  render?: JSX.Element;
}

export function OverlayTrigger(props: OverlayTriggerProps) {
  const overlay = useOverlay();
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "children",
    "as",
    "onClick",
    "render",
  ]);
  const onTriggerClick = (event: MouseEvent) => {
    local.onClick?.(event);
    const target = event.currentTarget as HTMLElement;
    overlay.setTriggerRect(target.getBoundingClientRect());
    const root = target.closest("[data-overlay-root]");
    const panels = Array.from(
      root?.querySelectorAll<HTMLElement>("[data-overlay-panel]") ?? [],
    );
    const next = panels.length
      ? panels.every((panel) => panel.style.display === "none")
      : !overlay.open();
    panels.forEach((panel) => {
      panel.style.display = next ? "" : "none";
    });
    overlay.setOpen(next);
  };

  if (local.as) {
    return (
      <Dynamic
        component={local.as}
        {...others}
        class={cn(local.className, local.class)}
        onClick={onTriggerClick}
      >
        {local.children}
      </Dynamic>
    );
  }

  if (local.render) {
    return (
      <span
        {...others}
        class={cn(local.className, local.class)}
        onClick={onTriggerClick}
      >
        {local.render}
      </span>
    );
  }

  return (
    <button
      type="button"
      {...(others as ComponentProps<"button">)}
      class={cn(local.className, local.class)}
      onClick={onTriggerClick}
    >
      {local.children}
    </button>
  );
}

export function maybeChecked(props: {
  checked?: boolean;
  defaultChecked?: boolean;
}) {
  return props.checked ?? props.defaultChecked ?? false;
}
