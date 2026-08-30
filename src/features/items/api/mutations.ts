import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createItem, updateItem } from "./service";
import { itemKeys } from "./queries";

export function useCreateItem() {
  const queryClient = useQueryClient();
  const fn = useServerFn(createItem);
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const fn = useServerFn(updateItem);
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}
