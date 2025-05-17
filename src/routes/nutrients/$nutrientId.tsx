import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/nutrients/$nutrientId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/nutrients/$nutrientId"!</div>
}
