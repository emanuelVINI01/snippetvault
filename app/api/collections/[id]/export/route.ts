import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, notFoundResponse, unauthorizedResponse } from "@/src/lib/api/responses";
import { CollectionService } from "@/src/services/collections/collection-service";
import { getFileExtension } from "@/src/utils/snippets/snippet-path";
import AdmZip from "adm-zip";

type ExportRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: ExportRouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "markdown";

    const collection = await CollectionService.getForExport(id, userId);

    if (!collection) return notFoundResponse();

    const cleanTitle = collection.title.replace(/[^a-zA-Z0-9_-]/g, "_");

    if (format === "json") {
      return new NextResponse(JSON.stringify(collection, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="playbook-${cleanTitle}.json"`,
        },
      });
    }

    if (format === "zip") {
      const zip = new AdmZip();

      let readme = `# Playbook: ${collection.title}\n\n`;
      if (collection.description) {
        readme += `${collection.description}\n\n`;
      }
      readme += `Este arquivo compactado contém os scripts do playbook.\n\n## Passos da Execução:\n\n`;

      collection.items.forEach((item, index) => {
        const stepName = `Passo ${index + 1}: ${item.snippet.title}`;
        readme += `- ${stepName}`;
        if (item.filePath) {
          readme += ` (Caminho: \`${item.filePath}\`)`;
        }
        readme += "\n";

        let entryPath = item.filePath;
        if (!entryPath) {
          const cleanSnippetTitle = item.snippet.title.replace(/[^a-zA-Z0-9_-]/g, "_");
          const ext = getFileExtension(item.snippet.language);
          entryPath = `steps/${index + 1}_${cleanSnippetTitle}.${ext}`;
        } else {
          entryPath = sanitizeZipPath(entryPath);
        }

        zip.addFile(entryPath, Buffer.from(item.snippet.code, "utf-8"));
      });

      zip.addFile("README.md", Buffer.from(readme, "utf-8"));

      const zipBuffer = zip.toBuffer();

      return new NextResponse(zipBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="playbook-${cleanTitle}.zip"`,
        },
      });
    }

    // Default: markdown
    let md = `# Playbook: ${collection.title}\n\n`;
    if (collection.description) {
      md += `${collection.description}\n\n`;
    }
    collection.items.forEach((item, index) => {
      md += `## Passo ${index + 1}: ${item.snippet.title}\n\n`;
      if (item.filePath) {
        md += `**Caminho do arquivo**: \`${item.filePath}\`\n\n`;
      }
      if (item.snippet.description) {
        md += `${item.snippet.description}\n\n`;
      }
      md += `\`\`\`${item.snippet.language.toLowerCase()}\n${item.snippet.code}\n\`\`\`\n\n`;
    });

    return new NextResponse(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="playbook-${cleanTitle}.md"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function sanitizeZipPath(pathStr: string): string {
  let clean = pathStr.replace(/^[/\\]+/, "");
  clean = clean.replace(/\.\.[/\\]/g, "");
  clean = clean.replace(/[:*?"<>|]/g, "_");
  return clean || "unnamed_file.txt";
}
