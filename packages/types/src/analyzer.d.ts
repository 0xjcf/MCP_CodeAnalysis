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
export declare const analysisOptionsSchema: z.ZodObject<{
    sourceCode: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    sourceCode: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    sourceCode: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const analysisResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    data?: unknown;
    error?: string | undefined;
}, {
    success: boolean;
    data?: unknown;
    error?: string | undefined;
}>;
