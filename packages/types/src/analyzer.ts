import { z } from 'zod';

export interface AnalysisOptions {
  sourceCode: string;
  [key: string]: unknown;
}

export interface AnalysisResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Analyzer {
  analyze(options: AnalysisOptions): Promise<AnalysisResult>;
}

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
