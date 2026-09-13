import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { filterQueryOptions } from "../api/queries";

import type { DashboardFilters } from "../api/types";
import { ColorFamily } from "@/lib/color";

const route = getRouteApi("/_protected/dashboard");

const groups: { key: keyof DashboardFilters; label: string }[] = [
  { key: "types", label: "Types" },
  { key: "brands", label: "Brands" },
  { key: "closetNames", label: "Closets" },
  { key: "colorFamilies", label: "Colors" },
];

const swatch: Record<ColorFamily, string> = {
  black: "#111111",
  white: "#FAFAFA",
  grey: "#9CA3AF",
  brown: "#7C4A1E",
  beige: "#E8DCC4",
  red: "#DC2626",
  orange: "#F97316",
  yellow: "#FACC15",
  green: "#16A34A",
  blue: "#2563EB",
  purple: "#7C3AED",
  pink: "#EC4899",
};

export const FilterSidebar = () => {
  const { data } = useSuspenseQuery(filterQueryOptions());
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const active = groups.some(({ key }) => search[key].length > 0);

  const toggle = (key: keyof DashboardFilters, name: ColorFamily | string) =>
    navigate({
      to: "/dashboard",
      search: (prev) => {
        const current = prev[key] as string[];
        return {
          ...prev,
          [key]: current.includes(name)
            ? current.filter((n) => n !== name)
            : [...current, name],
        };
      },
      replace: true,
    });

  return (
    <aside className="sticky top-16 flex flex-col gap-4 bg-white px-6 pt-6 pb-12 shadow-lg">
      {groups.map(({ key, label }) => (
        <fieldset key={key} className="flex flex-col gap-1">
          <legend className="mb-1 font-medium">{label}</legend>
          {data[key].map((name: ColorFamily | string) => (
            <Label key={name} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(search[key] as string[]).includes(name)}
                onChange={() => toggle(key, name)}
              />
              {key === "colorFamilies" && (
                <span
                  aria-hidden
                  className="size-3 rounded-full border"
                  style={{ backgroundColor: swatch[name as ColorFamily] }}
                />
              )}
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
