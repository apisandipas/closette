import { Link } from "@tanstack/react-router";

type SidebarLinks = {
  route: string;
  label: string;
};

const links: SidebarLinks[] = [
  { route: "/admin/items", label: "Items" },
  { route: "/admin/closets", label: "Closets" },
  { route: "/admin/brands", label: "Brands" },
  { route: "/admin/types", label: "Types" },
];

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-4 pt-6 pb-12">
      {links.map(({ route, label }) => {
        return (
          <Link
            key={route}
            to={route}
            className="p-6 rounded-lg text-md"
            activeProps={{
              className: "text-red-400 bg-primary text-white font-bold",
            }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
