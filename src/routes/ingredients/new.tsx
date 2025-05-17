import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ingredients/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ingedients/new"!</div>
}
