import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { NotFound } from "./components/not-found";
import { makeQueryClient } from "./lib/query-client";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = makeQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}
