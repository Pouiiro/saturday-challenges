import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/polls/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/polls/create"!</div>
}
