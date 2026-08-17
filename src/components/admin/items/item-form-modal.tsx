import ItemForm, { type ItemFormValues } from "@/components/admin/items/item-form";
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
import { useNavigate } from "@tanstack/react-router";

export type ItemFormModalProps = {
  title: string;
  description?: string;
  submitLabel: string;
  idPrefix: string;
  values?: ItemFormValues;
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
          <ItemForm idPrefix={idPrefix} values={values} />
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
