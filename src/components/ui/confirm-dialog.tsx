import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  createContext,
  useCallback,
  useState,
  useContext,
  type ReactNode,
} from "react";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
};

const ConfirmContext = createContext<
  (opts: ConfirmOptions) => Promise<boolean>
>(() => Promise.resolve(false));

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<{
    opts: ConfirmOptions;
    resolve: (ok: boolean) => void;
  } | null>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setRequest({ opts, resolve })),
    [],
  );

  const settle = (ok: boolean) => {
    request?.resolve(ok);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog
        open={request !== null}
        onOpenChange={(open) => {
          if (!open) settle(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{request?.opts.title}</AlertDialogTitle>
            {request?.opts.description && (
              <AlertDialogDescription>
                {request.opts.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => settle(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => settle(true)}>
              {request?.opts.confirmLabel ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
