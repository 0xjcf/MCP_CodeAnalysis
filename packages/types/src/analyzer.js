import { z } from 'zod';
export const analysisOptionsSchema = z
    .object({
    sourceCode: z.string(),
})
    .passthrough();
export const analysisResultSchema = z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.string().optional(),
});
