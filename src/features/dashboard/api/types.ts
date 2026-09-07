import { z } from "zod";

export const dashboardFiltersSchema = z.object({
  types: z.array(z.string()).catch([]),
  brands: z.array(z.string()).catch([]),
  closetNames: z.array(z.string()).catch([]),
});

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;
