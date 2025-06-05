import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';
import MainLayout from '@/features/core/components/MainLayout/MainLayout';

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [{}],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <MainLayout>
        <Outlet />
      </MainLayout>

      {/* <TanStackRouterDevtools />
       */}
    </>
  );
}
