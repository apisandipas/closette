import { Link } from "@tanstack/react-router";
import { DoorClosed, Shapes, Shirt, Tag, type LucideIcon } from "lucide-react";

type SidebarLinks = {
  route: string;
  label: string;
  icon?: LucideIcon;
};

const links: SidebarLinks[] = [
  { route: "/admin/items", label: "Items", icon: Shirt },
  { route: "/admin/closets", label: "Closets", icon: DoorClosed },
  { route: "/admin/brands", label: "Brands,", icon: Tag },
  { route: "/admin/types", label: "Types", icon: Shapes },
];

const Sidebar = () => {
  return (
    <div className="sticky top-16 flex flex-col gap-4 bg-white px-6 pt-6 pb-12 shadow-lg">
      {links.map(({ route, label, icon: Icon }) => {
        return (
          <Link
            key={route}
            to={route}
            className="text-md flex gap-4 rounded-lg p-6"
            activeProps={{
              className: "text-red-400 bg-primary text-white font-bold",
            }}
          >
            {Icon && <Icon />}
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
