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
import { useAppForm } from "@/lib/form";
import { useNavigate } from "@tanstack/react-router";
import { BrandFormValues, brandFormOpts } from "../api/form";
import { BrandFields } from "./brand-form";

export type BrandFormModalProps = {
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: BrandFormValues;
  onSubmit: (values: BrandFormValues) => Promise<void>;
};

export default function BrandFormModal({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmit,
}: BrandFormModalProps) {
  const navigate = useNavigate();
  const close = () => navigate({ to: "/admin/brands" });

  const form = useAppForm({
    ...brandFormOpts,
    defaultValues: defaultValues ?? brandFormOpts.defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      close();
    },
  });

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
            form.handleSubmit();
          }}
        >
          <BrandFields form={form} />
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
