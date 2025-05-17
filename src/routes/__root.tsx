import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';
import MainLayout from '@/features/core/components/main-layout/MainLayout';

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
