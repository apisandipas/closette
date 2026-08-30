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
import { ClosetFields } from "./closet-form";
import { useAppForm } from "@/lib/form";
import { closetFormOpts, ClosetFormValues } from "../api/form";

export type ClosetFormModalProps = {
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: ClosetFormValues;
  onSubmit: (values: ClosetFormValues) => Promise<void>;
};

/**
 * Route-driven modal: it is open for as long as its route is matched, and any
 * dismissal (backdrop, Escape, close button, Cancel) navigates back to the list.
 */
export default function ClosetFormModal({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmit,
}: ClosetFormModalProps) {
  const navigate = useNavigate();
  const close = () => navigate({ to: "/admin/closets" });

  const form = useAppForm({
    ...closetFormOpts,
    defaultValues: defaultValues ?? closetFormOpts.defaultValues,
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
          <ClosetFields form={form} />
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
