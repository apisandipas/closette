import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";

export function DevTools() {
  if (!import.meta.env.DEV) return null;

  return (
    <TanStackDevtools
      plugins={[{ ...formDevtoolsPlugin(), defaultOpen: true }]}
    />
  );
}
