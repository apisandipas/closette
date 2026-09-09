import { ClientOnly, getRouteApi } from "@tanstack/react-router";
import { Masonry } from "masonic";
import { MasonryCard } from "./masonry-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { dashboardQueryOptions } from "../api/queries";

const route = getRouteApi("/_protected/dashboard");

const MasonrySkeleton = ({ count }: { count: number }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="bg-muted-foreground/20 animate-pulse rounded-lg"
        style={{ height: 160 + ((i * 53) % 120) }}
      />
    ))}
  </div>
);

export const MasonryComponent = () => {
  const search = route.useSearch();
  const { data } = useSuspenseQuery(dashboardQueryOptions(search));
  return (
    <ClientOnly
      fallback={<MasonrySkeleton count={Math.min(data.length, 12)} />}
    >
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
