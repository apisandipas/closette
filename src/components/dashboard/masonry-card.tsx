type MasonryCardProps = {
  index: number;
  data: MasonryCardData;
  width: number;
};

type MasonryCardData = { id: number };

export const MasonryCard = ({
  index,
  data: { id },
  width,
}: MasonryCardProps) => (
  <div>
    <div>Index: {index}</div>
    <pre>ID: {id}</pre>
    <div>Column width: {width}</div>
  </div>
);
