import { Link } from "@tanstack/react-router";
import type { DashboardItem } from "../api/service";

type MasonryCardProps = { index: number; data: DashboardItem; width: number };

export const MasonryCard = ({ data }: MasonryCardProps) => (
  <Link
    to="/dashboard/$itemId"
    params={{ itemId: data.id }}
    search={(prev) => prev}
  >
    <div className="rounded-lg overflow-hidden bg-white shadow">
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.name} className="w-full" />
      )}
      <div className="p-2 text-sm">{data.name}</div>
    </div>
  </Link>
);
