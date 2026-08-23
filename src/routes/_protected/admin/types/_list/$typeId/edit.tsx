import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/types/_list/$typeId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admin/types/$typeId/edit"!</div>
}
