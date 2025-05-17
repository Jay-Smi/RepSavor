import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/ingredients/__layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/ingedients/__layout"!
      <Outlet />
    </div>
  );
}
