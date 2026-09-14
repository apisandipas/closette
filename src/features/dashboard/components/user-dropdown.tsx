import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

export function UserDropdown({
  userName,
  isAdmin = false,
}: {
  userName: string | undefined;
  isAdmin?: boolean;
}) {
  const navigate = useNavigate();

  const goToAdmin = async () => {
    navigate({ to: "/admin" });
  };

  const signOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {userName ? (
          <div className="flex flex-row items-center justify-center gap-3 pr-4">
            <User />
            {userName}
          </div>
        ) : (
          "Loading..."
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={goToAdmin}>Admin</DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate({ to: "/users" })}>
            Users
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
