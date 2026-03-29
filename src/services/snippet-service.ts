import { prisma } from "@/src/prisma";

export const SnippetService = {
  // Ler todos os snippets do usuário
  async getAll(userId: string) {
    return await prisma.snippet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Criar um novo snippet
  async create(userId: string, data: { 
    title: string; 
    code: string; 
    language: string; 
    description?: string; 
    tags: string[] 
  }) {
    return await prisma.snippet.create({
      data: { ...data, userId },
    });
  },

  // Atualizar um snippet existente
  async update(id: string, userId: string, data: Partial<{
    title: string;
    code: string;
    language: string;
    description: string;
    tags: string[];
  }>) {
    return await prisma.snippet.update({
      where: { id, userId },
      data,
    });
  },

  // Deletar um snippet
  async delete(id: string, userId: string) {
    return await prisma.snippet.delete({
      where: { id, userId },
    });
  },

  // Procurar snippets públicos globais
  async searchPublic(query: string) {
    const q = query.trim();
    return await prisma.snippet.findMany({
      where: {
        public: true,
        OR: q
          ? [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { language: { contains: q, mode: "insensitive" } },
              { tags: { hasSome: [q] } }, // for single match, or we could handle arbitrary text better. However, Prisma hasSome requires exact array match, so we might need has if we just want to match a tag exactly, or we can use raw query if we need insensitive match inside string array. Let's use string operations: `has: q` to check if tags array contains the exactly `q` or since tags are an array of strings we should probably stick to exact match for tags or omit it to avoid issues, Prisma supports `has` for single element, let's just omit tags string search or map it if needed. Actually we can just do title, description, language. Let's include `has` for tag if applicable. Wait, title/description/language are usually enough. I'll add title, description, and language. Let's add tags if possible using `has: q` although insensitive might be tricky.
            ]
          : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, image: true, id: true } } }, // include author info
    });
  },

  // Buscar um snippet pelo ID
  async getById(id: string) {
    return await prisma.snippet.findUnique({
      where: { id },
      include: { user: { select: { name: true, image: true, id: true } } },
    });
  },
};