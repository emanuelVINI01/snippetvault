import { z } from "zod";

export const aiSnippetRequestSchema = z.object({
  locale: z.enum(["pt", "en"]).default("pt"),
  checkOnly: z.boolean().optional(),
  forceRefresh: z.boolean().optional(),
});

const findingSchema = z.object({
  title: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  detail: z.string(),
});

const securityReportSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high"]),
  findings: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

const lineExplanationSchema = z.object({
  line: z.string(),
  explanation: z.string(),
});

const explanationsSchema = z.object({
  quick: z.string(),
  technical: z.string(),
  lineByLine: z.array(lineExplanationSchema),
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
  qualityScore: z.number().min(0).max(100).optional().default(75),
  securityReport: securityReportSchema.optional().default({ riskLevel: "low", findings: [] }),
  requirements: z.array(z.string()).optional().default([]),
  explanations: explanationsSchema.optional().default({ quick: "", technical: "", lineByLine: [] }),
});

export type AiSnippetAnalysis = z.infer<typeof aiSnippetAnalysisSchema>;
