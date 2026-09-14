import { formOptions } from "@tanstack/react-form";
import type { UserFormValues } from "./types";

export const userFormOpts = formOptions({
  defaultValues: {
    name: "",
    email: "",
    role: "user",
    password: "",
  } as UserFormValues,
});

export type { UserFormValues };
