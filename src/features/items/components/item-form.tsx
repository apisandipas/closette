import { withForm } from "@/lib/form";
import { itemFormOpts } from "../api/form";
import { FieldGroup } from "@/components/ui/field";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";

export type SelectDataItem = { id: string; name: string };

export const ItemFields = withForm({
  ...itemFormOpts,
  props: {} as {
    brands: SelectDataItem[];
    types: SelectDataItem[];
    closets: SelectDataItem[];
    currentImageUrl?: string | null;
  },
  render: ({ form, brands, types, closets, currentImageUrl }) => (
    <Tabs className="w-full max-w-md" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <FieldGroup className="gap-5">
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label="Name"
                placeholder="Too Cool Teen Skipper"
              />
            )}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
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
            <form.AppField name="color">
              {(field) => <field.ColorField label="Color" />}
            </form.AppField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="quantity">
              {(field) => <field.NumberField label="Quantity" />}
            </form.AppField>
            <form.AppField name="year">
              {(field) => <field.NumberField label="Year" />}
            </form.AppField>
          </div>
        </FieldGroup>
      </TabsContent>
      <TabsContent value="image">
        <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
          <div className="grid- grid-cols-1 gap-4">
            <form.AppField name="image">
              {(field) => (
                <field.ImageField label="Photo" currentUrl={currentImageUrl} />
              )}
            </form.AppField>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
});
