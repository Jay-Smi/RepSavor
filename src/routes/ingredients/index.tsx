import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ingredients/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ingedients/"!</div>
}
