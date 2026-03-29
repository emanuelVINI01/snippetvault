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
};