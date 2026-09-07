import { z } from "zod";

export const dashboardFiltersSchema = z.object({
  types: z.array(z.string()).default([]).catch([]),
  brands: z.array(z.string()).default([]).catch([]),
  closetNames: z.array(z.string()).default([]).catch([]),
});

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;
