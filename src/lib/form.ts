import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/lib/form-context";
import {
  TextField,
  NumberField,
  SelectField,
  SubmitButton,
  ColorField,
} from "@/components/form/fields";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, NumberField, SelectField, ColorField },
  formComponents: { SubmitButton },
});
