import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { userKeys } from "./queries";
import {
  createUser,
  deleteUser,
  sendPasswordReset,
  updateUser,
} from "./service";

export function useCreateUser() {
  const queryClient = useQueryClient();
  const fn = useServerFn(createUser);
  return useMutation({
    mutationFn: fn,
    meta: { successMessage: "User created", errorMessage: "User not created" },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const fn = useServerFn(updateUser);
  return useMutation({
    mutationFn: fn,
    meta: { successMessage: "User saved", errorMessage: "User not saved" },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const fn = useServerFn(deleteUser);
  return useMutation({
    mutationFn: fn,
    meta: { successMessage: "User deleted", errorMessage: "User not deleted" },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useSendPasswordReset() {
  const fn = useServerFn(sendPasswordReset);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Password reset sent",
      errorMessage: "Password reset not sent",
    },
  });
}
