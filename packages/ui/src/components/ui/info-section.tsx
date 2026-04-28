import { splitProps, type JSX } from "solid-js";
import { CopyButton } from "./copy-button";
import { cn } from "../../lib/utils";

type NativeSectionProps = JSX.HTMLAttributes<HTMLElement>;

export interface InfoSectionProps extends Omit<NativeSectionProps, "title"> {
  title: JSX.Element;
  className?: string;
  contentClass?: string;
  copyValue?: string;
  headerClass?: string;
  hint?: JSX.Element;
  icon?: JSX.Element;
  titleClass?: string;
  trailing?: JSX.Element;
}

export function InfoSection(props: InfoSectionProps) {
  const [local, others] = splitProps(props, [
    "children",
    "class",
    "className",
    "contentClass",
    "copyValue",
    "headerClass",
    "hint",
    "icon",
    "title",
    "titleClass",
    "trailing",
  ]);

  const trailing = () =>
    local.trailing ?? (local.copyValue ? <CopyButton value={local.copyValue} /> : null);

  return (
    <section {...others} class={cn("flex flex-col gap-4", local.className, local.class)}>
      <header class={cn("flex items-start justify-between gap-3", local.headerClass)}>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            {local.icon ? (
              <span class="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06]">
                {local.icon}
              </span>
            ) : null}
            <h2 class={cn("font-medium text-sm", local.titleClass)}>{local.title}</h2>
          </div>
          {local.hint ? (
            <p class="mt-1 text-muted-foreground text-xs leading-relaxed">{local.hint}</p>
          ) : null}
        </div>
        {trailing()}
      </header>
      <div class={cn("flex flex-col gap-4", local.contentClass)}>{local.children}</div>
    </section>
  );
}
