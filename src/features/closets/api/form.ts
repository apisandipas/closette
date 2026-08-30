import { formOptions } from "@tanstack/react-form";
import { closetFormSchema, type ClosetFormValues } from "./types";

export const closetFormOpts = formOptions({
  defaultValues: {
    name: "",
  } as ClosetFormValues,
  validators: { onSubmit: closetFormSchema },
});

export type { ClosetFormValues };
