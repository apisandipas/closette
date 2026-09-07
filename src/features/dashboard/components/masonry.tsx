import { ClientOnly, getRouteApi } from "@tanstack/react-router";
import { Masonry } from "masonic";
import { MasonryCard } from "./masonry-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { dashboardQueryOptions } from "../api/queries";

const route = getRouteApi("/_protected/dashboard/");

// masonic reads ResizeObserver during render, so it cannot run on the server.
export const MasonryComponent = () => {
  const search = route.useSearch();
  const { data } = useSuspenseQuery(dashboardQueryOptions(search));
  return (
    <ClientOnly>
      <Masonry
        key={JSON.stringify(search)}
        items={data}
        itemKey={(d) => d.id}
        render={MasonryCard}
        columnGutter={16}
      />
    </ClientOnly>
  );
};
