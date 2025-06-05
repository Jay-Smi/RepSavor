import { PropsWithChildren, useMemo } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

/**
 * Test router provider for testing components that use the router.
 */
export const TestRouter = (props: PropsWithChildren) => {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const router = useMemo(
    () =>
      createRouter({
        routeTree: rootRoute.addChildren([
          createRoute({
            path: '/',
            component: () => props.children,
            getParentRoute: () => rootRoute,
          }),
        ]),
      }),
    [props.children, rootRoute]
  );

  return <RouterProvider router={router} />;
};
