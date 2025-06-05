import { act, ReactNode } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { render as testingLibraryRender } from '@testing-library/react';
import { ThemeProvider } from '@/features/core/providers/ThemeProvider';

export async function render(component: ReactNode) {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([
      createRoute({
        path: '/',
        component: () => component,
        getParentRoute: () => rootRoute,
      }),
    ]),
  });

  await act(() =>
    router.navigate({
      to: '/',
    })
  );

  return testingLibraryRender(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
