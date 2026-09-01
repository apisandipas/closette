import ItemFormModal from "@/features/items/components/item-form-modal";
import type { ItemFormValues } from "@/features/items/api/types";
import { createFileRoute } from "@tanstack/react-router";
import {
  itemFormOptionsOptions,
  itemQueryOptions,
} from "@/features/items/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useUpdateItem } from "@/features/items/api/mutations";
import { toItemPayload } from "@/features/items/api/form";

export const Route = createFileRoute(
  "/_protected/admin/items/_list/$itemId/edit",
)({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(itemQueryOptions(params.itemId)),
      context.queryClient.ensureQueryData(itemFormOptionsOptions()),
    ]),
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  const { data: itemData } = useSuspenseQuery(itemQueryOptions(itemId));
  const { data: formOptionData } = useSuspenseQuery(itemFormOptionsOptions());
  const { mutateAsync } = useUpdateItem();

  const it = itemData.item;
  if (!it) return null;

  const onSubmit = async (values: ItemFormValues) => {
    await mutateAsync({ data: { id: itemId, ...toItemPayload(values) } });
  };

  return (
    <ItemFormModal
      title="Edit item"
      submitLabel="Save changes"
      defaultValues={{
        name: it.name,
        brandId: it.brandId ?? "",
        typeId: it.typeId ?? "",
        closetId: it.closetId ?? "",
        color: it.color ?? "",
        quantity: it.quantity,
        year: it.year,
        image: it.image ?? "",
      }}
      onSubmit={onSubmit}
      currentImageUrl={it.imageUrl}
      brands={formOptionData.brands}
      types={formOptionData.types}
      closets={formOptionData.closets}
    />
  );
}
