import { createRootRoute, Outlet } from '@tanstack/react-router';
import MainLayout from '@/features/core/components/layouts/AppLayout/AppLayout';

export const Route = createRootRoute({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
});
