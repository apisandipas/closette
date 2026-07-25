import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
  );
}

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => ({}),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div className="bg-pink-500">
      <h1 className="text-3xl font-bold underline">Hello World!</h1>
    </div>
  );
}
