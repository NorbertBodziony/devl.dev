// @ts-nocheck
import { splitProps } from "solid-js";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-solid";
import { Primitive } from "./_primitive";
import { cn } from "../../lib/utils";

const linkBase =
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0";
const linkSizes = {
  default: "h-9 px-[calc(--spacing(3)-1px)] sm:h-8",
  icon: "size-9 sm:size-8",
};
const linkVariants = {
  ghost: "border-transparent text-foreground hover:bg-accent active:bg-accent",
  outline:
    "border-input bg-popover text-foreground shadow-xs/5 hover:bg-accent/50 active:bg-accent/50 dark:bg-input/32 dark:hover:bg-input/64",
};

export const Pagination = (props: any) => (
  <Primitive
    as="nav"
    base="mx-auto flex w-full justify-center"
    aria-label="pagination"
    data-slot="pagination"
    {...props}
  />
);

export const PaginationContent = (props: any) => (
  <Primitive
    as="ul"
    base="flex flex-row items-center gap-1"
    data-slot="pagination-content"
    {...props}
  />
);

export const PaginationItem = (props: any) => (
  <Primitive as="li" data-slot="pagination-item" {...props} />
);

export function PaginationLink(props: any) {
  const [local, others] = splitProps(props, [
    "class",
    "className",
    "children",
    "isActive",
    "size",
  ]);
  const variant = () => (local.isActive ? "outline" : "ghost");
  const size = () => local.size ?? "icon";
  return (
    <a
      {...others}
      aria-current={local.isActive ? "page" : undefined}
      class={cn(
        linkBase,
        linkVariants[variant()],
        linkSizes[size()] ?? linkSizes.icon,
        local.className,
        local.class,
      )}
      data-active={local.isActive}
      data-slot="pagination-link"
    >
      {local.children}
    </a>
  );
}

export function PaginationPrevious(props: any) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      {...props}
      class={cn("max-sm:aspect-square max-sm:p-0", props.className, props.class)}
    >
      <ChevronLeftIcon class="sm:-ms-1" />
      <span class="max-sm:hidden">Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext(props: any) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      {...props}
      class={cn("max-sm:aspect-square max-sm:p-0", props.className, props.class)}
    >
      <span class="max-sm:hidden">Next</span>
      <ChevronRightIcon class="sm:-me-1" />
    </PaginationLink>
  );
}

export const PaginationEllipsis = (props: any) => (
  <Primitive
    as="span"
    base="flex min-w-7 justify-center"
    aria-hidden
    data-slot="pagination-ellipsis"
    {...props}
  >
    <MoreHorizontalIcon class="size-5 sm:size-4" />
    <span class="sr-only">More pages</span>
  </Primitive>
);
