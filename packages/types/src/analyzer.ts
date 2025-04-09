import { z } from 'zod';

export interface IAnalysisOptions {
  sourceCode: string;
  [key: string]: unknown;
}

export interface IAnalysisResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface IAnalyzer {
  analyze(options: IAnalysisOptions): Promise<IAnalysisResult>;
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
