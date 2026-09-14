import { FieldGroup } from "@/components/ui/field";
import { ROLES } from "@/lib/auth/roles";
import { withForm } from "@/lib/form";
import { userFormOpts } from "../api/form";

const roleOptions = ROLES.map((r) => ({ id: r, name: r }));

export const UserFields = withForm({
  ...userFormOpts,
  props: { passwordLabel: "Password" },
  render: ({ form, passwordLabel }) => (
    <FieldGroup>
      <form.AppField name="name">
        {(f) => <f.TextField label="Name" autoComplete="off" />}
      </form.AppField>
      <form.AppField name="email">
        {(f) => <f.TextField label="Email" type="email" autoComplete="off" />}
      </form.AppField>
      <form.AppField name="role">
        {(f) => (
          <f.SelectField
            label="Role"
            placeholder="Role"
            options={roleOptions}
          />
        )}
      </form.AppField>
      <form.AppField name="password">
        {(f) => (
          <f.TextField
            label={passwordLabel}
            type="password"
            autoComplete="new-password"
          />
        )}
      </form.AppField>
    </FieldGroup>
  ),
});
