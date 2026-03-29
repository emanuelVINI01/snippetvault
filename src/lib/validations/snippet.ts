import { z } from "zod";

export const createSnippetSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(64),
  code: z.string().min(1, "O código é obrigatório").max(25000),
  language: z.string().min(1, "A linguagem é obrigatória").max(32),
  description: z.string().max(1024).optional(),
  public: z.boolean().optional().default(false),
  tags: z.array(z.string().max(128)).optional().default([]),
});

export const updateSnippetSchema = createSnippetSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Pelo menos um campo deve ser atualizado" }
);

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>;
export type UpdateSnippetInput = z.infer<typeof updateSnippetSchema>;
