import { ClientOnly } from "@tanstack/react-router";
import { Masonry } from "masonic";
import { MasonryCard } from "./masonry-card";

let i = 0;
const items = Array.from(Array(200), () => ({ id: i++ }));

// masonic reads ResizeObserver during render, so it cannot run on the server.
export const MasonryComponent = () => (
  <ClientOnly>
    <Masonry items={items} render={MasonryCard} />
  </ClientOnly>
);
