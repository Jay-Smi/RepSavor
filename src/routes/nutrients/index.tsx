import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/nutrients/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/nutrients/"!</div>
}
