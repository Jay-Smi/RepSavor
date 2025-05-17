import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/consumption/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/consumption/"!</div>;
}
