import { createFileRoute, Link } from "@tanstack/react-router";
import { Rabbit } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <Link to="/dashboard">
        <div className="jusity-center font-heading flex items-center gap-4 text-xl font-bold">
          <Rabbit size={36} />
          Closette
        </div>
      </Link>
    </div>
  );
}
