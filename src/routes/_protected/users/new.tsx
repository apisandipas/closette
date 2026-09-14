import { useCreateUser } from "@/features/users/api/mutations";
import UserFormModal from "@/features/users/components/user-form-modal";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/users/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync } = useCreateUser();
  return (
    <UserFormModal
      mode="create"
      title="New user"
      description="Invite someone to Closette"
      submitLabel="Create user"
      onSubmit={(values) => mutateAsync({ data: values })}
    />
  );
}
