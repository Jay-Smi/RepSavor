import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/food-log/__layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/food-log/__layout"!
      <Outlet />
    </div>
  );
}
