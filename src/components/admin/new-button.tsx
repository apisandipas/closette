import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export default function NewButton(props: any) {
  return (
    <Link
      className="flex gap-2 bg-primary p-3 rounded-lg text-white"
      {...props}
    >
      <Plus /> New
    </Link>
  );
}
