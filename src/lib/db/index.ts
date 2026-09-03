import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { env } from "@/lib/env";

export const db = drizzle(env.DATABASE_URL!, { schema });
