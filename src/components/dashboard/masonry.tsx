import { Masonry } from "masonic";
import { MasonryCard } from "./masonry-card";

let i = 0;
const items = Array.from(Array(200), () => ({ id: i++ }));

export const MasonryComponent = () => {
  return <Masonry items={items} render={MasonryCard} />;
};
