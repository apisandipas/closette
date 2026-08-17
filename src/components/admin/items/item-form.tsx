import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ItemFormValues = {
  name: string;
  brand: string;
  type: string;
  color: string;
  size: string;
  notes: string;
};

const EMPTY: ItemFormValues = {
  name: "",
  brand: "",
  type: "",
  color: "",
  size: "",
  notes: "",
};

// Mocked options — swap for real brand/type queries once the loaders exist.
const BRANDS = ["Mattel", "Hasbro", "Tonner", "Integrity Toys"];
const TYPES = ["Dress", "Top", "Bottom", "Outerwear", "Shoes", "Accessory"];

const controlClass =
  "h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm";

export default function ItemForm({
  values = EMPTY,
  idPrefix,
}: {
  values?: ItemFormValues;
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

      <div className="gap-4 grid grid-cols-2">
        <Field>
          <FieldLabel htmlFor={id("brand")}>Brand</FieldLabel>
          <select
            id={id("brand")}
            name="brand"
            defaultValue={values.brand}
            className={cn(controlClass)}
          >
            <option value="">Select a brand</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor={id("type")}>Type</FieldLabel>
          <select
            id={id("type")}
            name="type"
            defaultValue={values.type}
            className={cn(controlClass)}
          >
            <option value="">Select a type</option>
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="gap-4 grid grid-cols-2">
        <Field>
          <FieldLabel htmlFor={id("color")}>Color</FieldLabel>
          <Input
            id={id("color")}
            name="color"
            defaultValue={values.color}
            placeholder="Sunset pink"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={id("size")}>Size</FieldLabel>
          <Input
            id={id("size")}
            name="size"
            defaultValue={values.size}
            placeholder="M"
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor={id("notes")}>Notes</FieldLabel>
        <textarea
          id={id("notes")}
          name="notes"
          rows={3}
          defaultValue={values.notes}
          placeholder="Anything worth remembering about this piece."
          className={cn(controlClass, "h-auto rounded-2xl py-2 resize-none")}
        />
      </Field>
    </FieldGroup>
  );
}
