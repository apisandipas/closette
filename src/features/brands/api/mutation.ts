import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { brandKeys } from "./queries";
import { createBrand, deleteBrand, updateBrand } from "./service";

export function useCreateBrand() {
  const queryClient = useQueryClient();
  const fn = useServerFn(createBrand);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Brand created",
      errorMessage: "Brand not created",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: brandKeys.all }),
  });
}
export function useUpdateBrand() {
  const queryClient = useQueryClient();
  const fn = useServerFn(updateBrand);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Brand updated",
      errorMessage: "Brand not updated",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: brandKeys.all }),
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  const fn = useServerFn(deleteBrand);
  return useMutation({
    mutationFn: fn,
    meta: {
      successMessage: "Brand deleted",
      errorMessage: "Brand now delelted",
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: brandKeys.all }),
  });
}
