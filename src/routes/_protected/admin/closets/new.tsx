import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/closets/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admin/closets/new"!</div>
}
