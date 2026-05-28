import { z } from "zod";

export const aiSnippetRequestSchema = z.object({
  locale: z.enum(["pt", "en"]).default("pt"),
});

const findingSchema = z.object({
  title: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  detail: z.string(),
});

export const aiSnippetAnalysisSchema = z.object({
  summary: z.string(),
  description: z.string(),
  language: z.string(),
  tags: z.array(z.string()).max(8),
  bugs: z.array(findingSchema).max(5),
  refactor: z.object({
    notes: z.array(z.string()).max(6),
    code: z.string(),
  }),
  example: z.object({
    title: z.string(),
    code: z.string(),
    notes: z.string(),
  }),
});

export type AiSnippetAnalysis = z.infer<typeof aiSnippetAnalysisSchema>;
