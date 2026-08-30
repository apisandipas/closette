import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      skipToast?: boolean;
      successTitle?: string;
      successMessage?: string;
      errorTitle?: string;
      errorMessage?: string;
    };
  }
}

export const makeQueryClient = () => {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage && !mutation.meta?.skipToast) {
          toast.add({
            type: "success",
            title: mutation.meta?.successTitle ?? "Success!",
            description: mutation.meta?.successMessage ?? undefined,
          });
        }
      },
      onError: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.errorMessage && !mutation.meta.skipToast) {
          toast.add({
            type: "error",
            title: mutation.meta?.errorTitle ?? "Error!",
            description: mutation.meta.errorMessage ?? undefined,
          });
        }
      },
    }),
  });

  return queryClient;
};
