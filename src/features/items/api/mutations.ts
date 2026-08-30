import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { itemKeys } from "./queries";
import { createItem, deleteItem, updateItem } from "./service";

export function useCreateItem() {
  const queryClient = useQueryClient();
  const fn = useServerFn(createItem);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Item created.",
      errorMessage: "Item not created",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const fn = useServerFn(updateItem);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Item updated.",
      errorMessage: "Item not updarted",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const fn = useServerFn(deleteItem);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Item deleted",
      errorMessage: "Item not deleted",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}
