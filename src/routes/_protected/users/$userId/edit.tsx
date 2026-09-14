import { useUpdateUser } from "@/features/users/api/mutations";
import { userQueryOptions } from "@/features/users/api/queries";
import UserFormModal from "@/features/users/components/user-form-modal";
import { ROLES, type Role } from "@/lib/auth/roles";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/users/$userId/edit")({
  loader: async ({ context, params }) => {
    const { user } = await context.queryClient.ensureQueryData(
      userQueryOptions(params.userId),
    );
    if (!user) throw notFound();
  },
  component: RouteComponent,
});

const asRole = (r: string | null | undefined): Role =>
  ROLES.includes(r as Role) ? (r as Role) : "user";

function RouteComponent() {
  const { userId } = Route.useParams();
  const { data } = useSuspenseQuery(userQueryOptions(userId));
  const { mutateAsync } = useUpdateUser();
  const user = data.user!;
  return (
    <UserFormModal
      mode="edit"
      title="Edit user"
      description="Change name, email, or role"
      submitLabel="Update user"
      defaultValues={{
        name: user.name,
        email: user.email,
        role: asRole(user.role),
        password: "",
      }}
      onSubmit={(values) => mutateAsync({ data: { id: userId, ...values } })}
    />
  );
}
