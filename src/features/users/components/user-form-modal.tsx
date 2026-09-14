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
import type { z } from "zod";
import { userFormOpts } from "../api/form";
import {
  createUserSchema,
  editUserFormSchema,
  type UserFormValues,
} from "../api/types";
import { UserFields } from "./user-form";

export type UserFormModalProps = {
  mode: "create" | "edit";
  title: string;
  description?: string;
  submitLabel: string;
  defaultValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<unknown>;
};

export default function UserFormModal({
  mode,
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmit,
}: UserFormModalProps) {
  const navigate = useNavigate();
  const close = () => navigate({ to: "/users", search: (prev) => prev });

  const schema: z.ZodType<UserFormValues, UserFormValues> =
    mode === "create" ? createUserSchema : editUserFormSchema;
  const form = useAppForm({
    ...userFormOpts,
    defaultValues: defaultValues ?? userFormOpts.defaultValues,
    validators: { onSubmit: schema },
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
          <UserFields
            form={form}
            passwordLabel={
              mode === "create" ? "Password" : "New password (blank to keep)"
            }
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
