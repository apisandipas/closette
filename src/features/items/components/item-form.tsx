import { withForm } from "@/lib/form";
import { itemFormOpts } from "../api/form";
import { FieldGroup } from "@/components/ui/field";

export type SelectDataItem = { id: string; name: string };

export const ItemFields = withForm({
  ...itemFormOpts,
  props: {} as {
    brands: SelectDataItem[];
    types: SelectDataItem[];
    closets: SelectDataItem[];
  },
  render: ({ form, brands, types, closets }) => (
    <FieldGroup className="gap-5">
      <form.AppField name="name">
        {(field) => (
          <field.TextField label="Name" placeholder="Too Cool Teen Skipper" />
        )}
      </form.AppField>
      <div className="gap-4 grid grid-cols-2">
        <form.AppField name="brandId">
          {(field) => (
            <field.SelectField
              label="Brand"
              placeholder="Select a brand"
              options={brands}
            />
          )}
        </form.AppField>
        <form.AppField name="typeId">
          {(field) => (
            <field.SelectField
              label="Type"
              placeholder="Select a type"
              options={types}
            />
          )}
        </form.AppField>
        <form.AppField name="closetId">
          {(field) => (
            <field.SelectField
              label="Closet"
              placeholder="Select a closet"
              options={closets}
            />
          )}
        </form.AppField>
      </div>
      <div className="gap-4 grid grid-cols-2">
        <form.AppField name="quantity">
          {(field) => <field.NumberField label="Quantity" />}
        </form.AppField>
        <form.AppField name="year">
          {(field) => <field.NumberField label="Year" />}
        </form.AppField>
      </div>
    </FieldGroup>
  ),
});
