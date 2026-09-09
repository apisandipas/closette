import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export default function NewButton(props: any) {
  return (
    <Link
      className="bg-primary flex gap-2 rounded-lg p-3 text-white"
      {...props}
    >
      <Plus /> New
    </Link>
  );
}
