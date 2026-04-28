// @ts-nocheck
import { createFileRoute } from "@tanstack/solid-router";
import { DemoApp } from "@/pages/demo/app";

export const Route = createFileRoute("/demo")({
  component: DemoApp,
});
