import { FieldGroup } from "@/components/ui/field";
import { withForm } from "@/lib/form";
import { closetFormOpts } from "../api/form";

export const ClosetFields = withForm({
  ...closetFormOpts,
  render: ({ form }) => (
    <FieldGroup>
      <form.AppField name="name">
        {(field) => (
          <field.TextField label="Name" placeholder="Too Cool Teen Skipper" />
        )}
      </form.AppField>
    </FieldGroup>
  ),
});
