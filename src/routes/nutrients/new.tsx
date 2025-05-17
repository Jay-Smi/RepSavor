import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/nutrients/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/nutrients/new"!</div>
}
