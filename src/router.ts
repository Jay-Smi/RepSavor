import { createRouter } from '@tanstack/react-router';
import LoadingPage from './features/core/pages/LoadingPage';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingPage,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
