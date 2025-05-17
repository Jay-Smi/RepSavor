import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/food-log/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/food-log/"!</div>;
}
