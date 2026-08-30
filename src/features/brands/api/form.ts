import { formOptions } from "@tanstack/react-form";
import { brandFormSchema, type BrandFormValues } from "./types";

export const brandFormOpts = formOptions({
  defaultValues: {
    name: "",
  } as BrandFormValues,
  validators: { onSubmit: brandFormSchema },
});

export type { BrandFormValues };
