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
import { TypeFormValues, typeFormOpts } from "../api/form";
import { TypeFields } from "./type-form";

export type TypeFormModalProps = {
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: TypeFormValues;
  onSubmit: (values: TypeFormValues) => Promise<void>;
};

export default function TypeFormModal({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmit,
}: TypeFormModalProps) {
  const navigate = useNavigate();
  const close = () => navigate({ to: "/admin/types" });

  const form = useAppForm({
    ...typeFormOpts,
    defaultValues: defaultValues ?? typeFormOpts.defaultValues,
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
          <TypeFields form={form} />
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
