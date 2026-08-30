import { formOptions } from "@tanstack/react-form";
import { typeFormSchema, type TypeFormValues } from "./types";

export const typeFormOpts = formOptions({
  defaultValues: {
    name: "",
  } as TypeFormValues,
  validators: { onSubmit: typeFormSchema },
});

export type { TypeFormValues };
