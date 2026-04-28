import { splitProps, type JSX } from "solid-js";
import { Label } from "@orbit/ui/label";

type NativeSectionProps = JSX.HTMLAttributes<HTMLElement>;
type NativeDivProps = JSX.HTMLAttributes<HTMLDivElement>;
type NativeSelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement>;

export interface SettingsSectionProps extends Omit<NativeSectionProps, "title"> {
  title: JSX.Element;
  className?: string;
  hint?: JSX.Element;
  icon?: JSX.Element;
  layout?: "stack" | "split";
  contentClass?: string;
  titleClass?: string;
}

export function SettingsSection(props: SettingsSectionProps) {
  const [local, others] = splitProps(props, [
    "children",
    "class",
    "className",
    "contentClass",
    "hint",
    "icon",
    "layout",
    "title",
    "titleClass",
  ]);
  const split = () => local.layout === "split";

  return (
    <section
      {...others}
      class={
        split()
          ? `mt-8 grid grid-cols-[180px_minmax(0,1fr)] gap-x-10 gap-y-6 ${local.className ?? local.class ?? ""}`
          : local.className ?? local.class
      }
    >
      <div>
        <div class="flex items-center gap-2">
          {local.icon ? (
            <span class="inline-flex size-6 items-center justify-center rounded-md bg-foreground/[0.06]">
              {local.icon}
            </span>
          ) : null}
          <h2 class={local.titleClass ?? (split() ? "font-medium text-sm" : "font-heading text-base")}>
            {local.title}
          </h2>
        </div>
        {local.hint ? (
          <p class="mt-1 text-muted-foreground text-xs leading-relaxed">{local.hint}</p>
        ) : null}
      </div>
      <div class={local.contentClass ?? (split() ? "flex flex-col gap-5" : "mt-4 flex flex-col gap-4")}>
        {local.children}
      </div>
    </section>
  );
}

export interface SettingsFieldProps extends NativeDivProps {
  label: JSX.Element;
  className?: string;
  htmlFor?: string;
  hint?: JSX.Element;
}

export function SettingsField(props: SettingsFieldProps) {
  const [local, others] = splitProps(props, [
    "children",
    "class",
    "className",
    "hint",
    "htmlFor",
    "label",
  ]);

  return (
    <div {...others} class={`flex flex-col gap-1.5 ${local.className ?? local.class ?? ""}`}>
      {local.htmlFor ? (
        <Label htmlFor={local.htmlFor}>{local.label}</Label>
      ) : (
        <span class="inline-flex font-medium text-foreground text-sm">{local.label}</span>
      )}
      {local.children}
      {local.hint ? <p class="text-muted-foreground text-xs">{local.hint}</p> : null}
    </div>
  );
}

export interface NativeSelectPropsWithIcon extends NativeSelectProps {
  className?: string;
  icon?: JSX.Element;
}

export function NativeSelect(props: NativeSelectPropsWithIcon) {
  const [local, others] = splitProps(props, ["class", "className", "icon"]);

  return (
    <div class="relative">
      {local.icon ? (
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {local.icon}
        </span>
      ) : null}
      <select
        {...others}
        class={`h-9 w-full appearance-none rounded-lg border border-input bg-background ${
          local.icon ? "pl-8" : "pl-3"
        } pr-9 text-sm outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/24 ${
          local.className ?? local.class ?? ""
        }`}
      />
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden
        class="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 opacity-60"
      >
        <polyline points="4 6 8 10 12 6" />
      </svg>
    </div>
  );
}
