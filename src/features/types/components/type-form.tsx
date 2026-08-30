import { FieldGroup } from "@/components/ui/field";
import { withForm } from "@/lib/form";
import { typeFormOpts } from "../api/form";

export const TypeFields = withForm({
  ...typeFormOpts,
  render: ({ form }) => (
    <FieldGroup>
      <form.AppField name="name">
        {(field) => <field.TextField label="Name" placeholder="Mattel" />}
      </form.AppField>
    </FieldGroup>
  ),
});
