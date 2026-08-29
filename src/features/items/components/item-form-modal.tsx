import ItemForm, { type ItemFormValues } from "@/features/items/components/item-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { StringLiteral } from "typescript";
import { string } from "zod";

export type SelectDataItem = {
  name: string;
  id: string;
}

export type ItemFormModalProps = {
  title: string;
  description?: string;
  submitLabel: string;
  idPrefix: string;
  values?: ItemFormValues;
  brands: SelectDataItem[],
  types: SelectDataItem[]
};


/**
 * Route-driven modal: it is open for as long as its route is matched, and any
 * dismissal (backdrop, Escape, close button, Cancel) navigates back to the list.
 */
export default function ItemFormModal({
  title,
  description,
  submitLabel,
  idPrefix,
  values,
  brands,
  types,
}: ItemFormModalProps) {
  const navigate = useNavigate();
  const close = () => navigate({ to: "/admin/items" });

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            close();
          }}
        >
          <ItemForm idPrefix={idPrefix} values={values} brands={brands} types={types} />
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
