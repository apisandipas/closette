import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { a11yDevtoolsPlugin } from "@tanstack/devtools-a11y/react";

export function DevTools() {
  if (!import.meta.env.DEV) return null;

  return (
    <TanStackDevtools
      plugins={[
        {
          name: "TanStack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
        {
          name: "Tanstack Form",
          render: <FormDevtoolsPanel />,
        },
        a11yDevtoolsPlugin(),
      ]}
    />
  );
}
