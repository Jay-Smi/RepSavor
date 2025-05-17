import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ingredients/$ingredientId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ingedients/$ingredientId"!</div>
}
