import { useAppForm } from "@/lib/form";
import { itemFormOpts, type ItemFormValues } from "../api/form";
import { ItemFields, type SelectDataItem } from "./item-form";
import {
  Dialog,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export type ItemFormModalProps = {
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: ItemFormValues;
  brands: SelectDataItem[];
  types: SelectDataItem[];
  closets: SelectDataItem[];
  currentImageUrl?: string | null;
  onSubmit: (values: ItemFormValues) => Promise<void>;
};

export default function ItemFormModal({
  title,
  description,
  submitLabel,
  defaultValues,
  brands,
  types,
  closets,
  currentImageUrl,
  onSubmit,
}: ItemFormModalProps) {
  const navigate = useNavigate();
  const close = () => navigate({ to: "/admin/items" });

  const form = useAppForm({
    ...itemFormOpts,
    defaultValues: defaultValues ?? itemFormOpts.defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      close(); // only reached on success; a thrown mutation
    },
  });

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}.</DialogDescription>}
        </DialogHeader>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <ItemFields
            form={form}
            brands={brands}
            types={types}
            closets={closets}
            currentImageUrl={currentImageUrl}
          />
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <form.AppForm>
              <form.SubmitButton label={submitLabel} />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
