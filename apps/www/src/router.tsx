// @ts-nocheck
import { createRouter } from '@tanstack/solid-router'
import { routeTree } from './routeTree.gen'
import { NotFoundPage } from '@/pages/not-found'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultNotFoundComponent: NotFoundPage,
  })
}

declare module '@tanstack/solid-router' {
  interface Register { router: ReturnType<typeof getRouter> }
}
