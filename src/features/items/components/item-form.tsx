import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ItemFormValues = {
  name: string;
  brand?: string;
  type?: string;
  quantity: number;
  year: string;
  notes: string;
};

const EMPTY: ItemFormValues = {
  name: "",
  brand: "",
  type: "",
  quantity: 0,
  year: "",
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
          <FieldLabel htmlFor={id("quanity")}>Quanity</FieldLabel>
          <Input
            id={id("quanity")}
            type="number"
            name="quanity"
            defaultValue={values.quantity}
            placeholder="0"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={id("year")}>Year</FieldLabel>
          <Input
            id={id("year")}
            type="year"
            name="year"
            defaultValue={values.year}
            placeholder="1959"
          />
        </Field>
      </div>
    </FieldGroup>
  );
}
