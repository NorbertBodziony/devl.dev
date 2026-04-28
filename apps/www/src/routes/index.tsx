// @ts-nocheck
import { createFileRoute } from '@tanstack/solid-router'
import { LandingPage } from '@/pages/landing'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
