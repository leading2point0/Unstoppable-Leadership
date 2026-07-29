import { z } from "zod";

export const logLeadMeasureEntrySchema = z.object({
  programId: z.string().uuid(),
  moduleSlug: z.string().min(1),
  label: z.string().min(1),
  unit: z.string().optional(),
  target: z.coerce.number().optional(),
  entryDate: z.string().min(1),
  actual: z.coerce.number(),
  notes: z.string().max(500).optional(),
});
export type LogLeadMeasureEntryInput = z.infer<typeof logLeadMeasureEntrySchema>;
