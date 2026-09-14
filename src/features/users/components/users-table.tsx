import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-dialog";
import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useDeleteUser, useSendPasswordReset } from "../api/mutations";
import type { User } from "../api/types";

export type UsersTableProps = {
  users: Array<User>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<User>();
const route = getRouteApi("/_protected/users");

function UsersTable({ users, pagination, search }: UsersTableProps) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const me = route.useRouteContext().user;
  const remove = useDeleteUser();
  const reset = useSendPasswordReset();

  const removeRow = async (row: User) => {
    if (row.id === me.id) return;
    const ok = await confirm({
      title: "Delete user",
      description: `${row.email} will be permanently removed`,
      confirmLabel: "Delete",
    });
    if (ok) await remove.mutateAsync({ data: { id: row.id } });
  };

  const resetRow = async (row: User) => {
    const ok = await confirm({
      title: "Send password reset",
      description: `${row.email} will get an email with a reset link`,
      confirmLabel: "Send",
    });
    if (ok) await reset.mutateAsync({ data: { email: row.email } });
  };

  const columns = columnHelper.columns([
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (c) => c.getValue() ?? "user",
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: (c) => new Date(c.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "actions",
      cell: (c) => (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Send password reset"
          onClick={(e) => {
            e.stopPropagation();
            resetRow(c.row.original);
          }}
        >
          <KeyRound />
        </Button>
      ),
    }),
  ]);

  return (
    <DataTable
      data={users}
      columns={columns}
      openRow={(row) =>
        navigate({
          to: "/users/$userId/edit",
          params: { userId: row.id },
          search: (prev) => prev,
        })
      }
      removeRow={removeRow}
      pagination={pagination}
      search={search}
      searchPlaceholder="Search emails..."
      emptyMessage="No users yet."
    />
  );
}

export default UsersTable;
