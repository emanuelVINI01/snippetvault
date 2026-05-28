import { z } from "zod";

export const collectionCreateSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(280).optional(),
  accent: z.string().trim().min(1).max(24).optional(),
});

export const collectionUpdateSchema = collectionCreateSchema.partial();

export const collectionSnippetSchema = z.object({
  snippetId: z.string().min(1),
});

export type CollectionCreateInput = z.infer<typeof collectionCreateSchema>;
export type CollectionUpdateInput = z.infer<typeof collectionUpdateSchema>;
