import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/food-log/meal/$mealId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/food-log/meal/$mealId"!</div>
}
