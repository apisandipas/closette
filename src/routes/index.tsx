import { createFileRoute, Link } from "@tanstack/react-router";
import { Rabbit } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <Link to="/dashboard">
        <div className="flex gap-4 font-bold text-xl jusity-center items-center font-heading">
          <Rabbit size={36} />
          Closette
        </div>
      </Link>
    </div>
  );
}
