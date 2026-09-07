import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { filterQueryOptions } from "../api/queries";

import type { DashboardFilters } from "../api/types";

const route = getRouteApi("/_protected/dashboard");

const groups: { key: keyof DashboardFilters; label: string }[] = [
  { key: "types", label: "Types" },
  { key: "brands", label: "Brands" },
  { key: "closetNames", label: "Closets" },
];

export const FilterSidebar = () => {
  const { data } = useSuspenseQuery(filterQueryOptions());
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const active = groups.some(({ key }) => search[key].length > 0);

  const toggle = (key: keyof DashboardFilters, name: string) =>
    navigate({
      to: "/dashboard",
      search: (prev) => ({
        ...prev,
        [key]: prev[key].includes(name)
          ? prev[key].filter((n) => n !== name)
          : [...prev[key], name],
      }),
      replace: true,
    });

  return (
    <aside className="sticky top-16 flex flex-col gap-4 pt-6 pb-12 px-6 bg-white shadow-lg">
      {groups.map(({ key, label }) => (
        <fieldset key={key} className="flex flex-col gap-1">
          <legend className="font-medium mb-1">{label}</legend>
          {data[key].map((name) => (
            <Label key={name} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={search[key].includes(name)}
                onChange={() => toggle(key, name)}
              />
              {name}
            </Label>
          ))}
        </fieldset>
      ))}

      <Link
        to="/dashboard"
        search={{}}
        replace
        aria-disabled={!active}
        className="mt-auto self-end text-sm underline aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        Clear filters
      </Link>
    </aside>
  );
};
