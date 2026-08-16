import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/brands/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admin/brands/new"!</div>
}
