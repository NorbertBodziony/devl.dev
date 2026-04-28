// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/solid-router";
import { NotFoundPage } from "@/pages/not-found";

export const Route = createFileRoute("/c/$category")({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});
