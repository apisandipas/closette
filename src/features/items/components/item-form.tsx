import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SelectDataItem } from "./item-form-modal";

export type ItemFormValues = {
  name: string;
  brand?: string;
  type?: string;
  quantity: number;
  year: number;
};

const EMPTY: ItemFormValues = {
  name: "",
  brand: "",
  type: "",
  quantity: 0,
  year: 1959,
};

const controlClass =
  "h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm";

export default function ItemForm({
  values = EMPTY,
  brands, types,
  idPrefix,
}: {
  values?: ItemFormValues;
  brands: SelectDataItem[];
  types: SelectDataItem[];
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
            {brands.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
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
            {types.map(({ name, id }) => (
              <option key={id} value={id}>
                {name}
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
    </FieldGroup >
  );
}
