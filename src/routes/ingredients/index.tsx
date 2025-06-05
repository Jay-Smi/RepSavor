import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@mantine/core';

export const Route = createFileRoute('/ingredients/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Card h="400px" w="300px" />;
}
