import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/nutrients/__layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/nutrients/__layout"!
      <Outlet />
    </div>
  );
}
