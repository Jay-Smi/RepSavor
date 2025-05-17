import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ingredients/$ingredientId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ingedients/$ingredientId/edit"!</div>
}
