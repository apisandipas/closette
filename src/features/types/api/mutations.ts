import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { typeKeys } from "./queries";
import { createType, deleteType, updateType } from "./service";

export function useCreateType() {
  const queryClient = useQueryClient();
  const fn = useServerFn(createType);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Type option created",
      errorMessage: "Type option not created",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: typeKeys.all }),
  });
}

export function useUpdateType() {
  const queryClient = useQueryClient();
  const fn = useServerFn(updateType);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Type option updated",
      errorMessage: "Type option not updated",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: typeKeys.all }),
  });
}

export function useDeleteType() {
  const queryClient = useQueryClient();
  const fn = useServerFn(deleteType);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Type option deleted",
      errorMessage: "Type option not deleted",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: typeKeys.all }),
  });
}
