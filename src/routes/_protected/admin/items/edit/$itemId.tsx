import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/items/edit/$itemId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admin/items/edit/$"!</div>
}
