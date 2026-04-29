import { ArrowRightIcon, FolderPlusIcon, ImportIcon } from "lucide-solid";
import { Button } from "@orbit/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@orbit/ui/empty";
import { Separator } from "@orbit/ui/separator";

export function EmptyFirstProjectShowcasePage() {
  return (
    <div class="min-h-svh bg-background">
      <header class="border-border/60 border-b">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div class="flex items-center gap-2 font-mono text-xs">
            <span class="inline-block h-2 w-2 rounded-full bg-foreground" />
            <span class="tracking-[0.2em] uppercase">Workspace</span>
            <span class="text-muted-foreground">/ sean</span>
          </div>
          <div class="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            Day 1
          </div>
        </div>
      </header>

      <main class="mx-auto flex max-w-5xl items-center px-6 py-16 lg:py-24">
        <Empty class="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderPlusIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Start your first project.</EmptyTitle>
            <EmptyDescription>
              A project is where you'll keep tasks, docs, and assets. Most
              teams start with one and split things out later.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="lg" class="w-full max-w-xs">
              Create project
              <ArrowRightIcon />
            </Button>
            <div class="flex items-center gap-3 text-muted-foreground text-xs">
              <Separator class="flex-1" />
              <span class="font-mono uppercase tracking-[0.3em]">or</span>
              <Separator class="flex-1" />
            </div>
            <Button variant="outline" size="lg" class="w-full max-w-xs">
              <ImportIcon />
              Import from Linear or Notion
            </Button>
            <p class="pt-2 text-muted-foreground text-xs">
              You can rename, archive, or delete a project anytime.
            </p>
          </EmptyContent>
        </Empty>
      </main>
    </div>
  );
}
