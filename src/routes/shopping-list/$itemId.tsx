import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shopping-list/$itemId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/shopping-list/$itemId"!</div>
}
