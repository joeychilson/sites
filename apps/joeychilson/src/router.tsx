import { createRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultViewTransition: { types: ({ pathChanged }) => (pathChanged ? ['page'] : false) },
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
