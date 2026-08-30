import { formOptions } from "@tanstack/react-form";
import { itemFormSchema, type ItemFormValues } from "./types";

export const itemFormOpts = formOptions({
  defaultValues: {
    name: "",
    brandId: "",
    typeId: "",
    closetId: "",
    quantity: 1,
    year: 1959,
  } as ItemFormValues,
  validators: { onSubmit: itemFormSchema },
});

// Form values -> server payload: empty select becomes null.
export function toItemPayload(values: ItemFormValues) {
  return {
    ...values,
    brandId: values.brandId || null,
    typeId: values.typeId || null,
    closetId: values.closetId || null,
  };
}

export type { ItemFormValues };
