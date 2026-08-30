import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { closetKeys } from "./queries";
import { createCloset, deleteCloset, updateCloset } from "./service";

export function useCreateCloset() {
  const queryClient = useQueryClient();
  const fn = useServerFn(createCloset);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Closet created",
      errorMessage: "Closet not created",
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: closetKeys.all }),
  });
}
export function useUpdateCloset() {
  const queryClient = useQueryClient();
  const fn = useServerFn(updateCloset);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Closet updated!",
      errorMessage: "Closet not updated",
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: closetKeys.all }),
  });
}

export function useDeleteCloset() {
  const queryClient = useQueryClient();
  const fn = useServerFn(deleteCloset);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Closet deleted",
      errorMessage: "Closet not deleted",
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: closetKeys.all }),
  });
}
