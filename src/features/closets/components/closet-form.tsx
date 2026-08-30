import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type ClosetFormValues = {
  name: string;
};

const EMPTY: ClosetFormValues = {
  name: "",
};

// Mocked options — swap for real brand/type queries once the loaders exist.
const BRANDS = ["Mattel", "Hasbro", "Tonner", "Integrity Toys"];
const TYPES = ["Dress", "Top", "Bottom", "Outerwear", "Shoes", "Accessory"];

const controlClass =
  "h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm";

export default function ClosetForm({
  values = EMPTY,
  idPrefix,
}: {
  values?: ClosetFormValues;
  idPrefix: string;
}) {
  const id = (field: string) => `${idPrefix}-${field}`;

  return (
    <FieldGroup className="gap-5">
      <Field>
        <FieldLabel htmlFor={id("name")}>Name</FieldLabel>
        <Input
          id={id("name")}
          name="name"
          defaultValue={values.name}
          placeholder="Too Cool Teen Skipper"
        />
      </Field>
    </FieldGroup>
  );
}
