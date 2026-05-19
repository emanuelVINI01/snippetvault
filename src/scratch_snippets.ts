import { prisma } from "./prisma";

async function main() {
  try {
    const snippets = await prisma.snippet.findMany({
      select: { id: true, title: true, public: true }
    });
    console.log("SNIPPETS:", JSON.stringify(snippets, null, 2));
  } catch (err) {
    console.error("ERROR QUERYING:", err);
  }
}

main();
