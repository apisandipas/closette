import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { itemQueryOptions } from "@/features/items/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dashboard/$itemId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(itemQueryOptions(params.itemId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  const navigate = Route.useNavigate();
  const { data } = useSuspenseQuery(itemQueryOptions(itemId));

  // search: (prev) => prev keeps the filters; replace keeps the modal out of history.
  const close = () =>
    navigate({ to: "/dashboard", search: (prev) => prev, replace: true });

  const it = data.item;
  if (!it) return null;

  const dtShared = "text-muted-foreground font-bold";

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-2xl">
        <div className="grid min-h-72 grid-cols-[16rem_1fr] gap-6">
          {it.imageUrl && (
            <img
              src={it.imageUrl}
              alt={it.name}
              className="h-full w-full rounded-lg object-cover"
            />
          )}
          <div className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">{it.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-3 text-lg">
                {it.color && (
                  <span
                    className="inline-block size-6 rounded border"
                    style={{ backgroundColor: it.color }}
                    title={it.color}
                  />
                )}
                {it.year}
              </DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-lg">
              <dt className={dtShared}>Brand:</dt>
              <dd>{it.brand?.name ?? "—"}</dd>
              <dt className={dtShared}>Type:</dt>
              <dd>{it.type?.name ?? "—"}</dd>
              <dt className={dtShared}>Quantity:</dt>
              <dd>{it.quantity}</dd>
              <dt className={dtShared}>Closet:</dt>
              <dd>{it.closet?.name ?? "—"}</dd>
            </dl>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
