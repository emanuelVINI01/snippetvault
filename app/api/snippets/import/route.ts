import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, unauthorizedResponse } from "@/src/lib/api/responses";
import { z } from "zod";
import dns from "dns";
import { promisify } from "util";
import path from "path";

const lookup = promisify(dns.lookup);

const importSchema = z.object({
  url: z.string().url("URL inválida"),
});

export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { url } = importSchema.parse(body);

    const safe = await isSafeUrl(url);
    if (!safe) {
      return NextResponse.json(
        { error: "URL insegura ou domínio não permitido" },
        { status: 400 },
      );
    }

    const rawUrl = convertGithubUrlToRaw(url);

    const fetchResponse = await fetch(rawUrl, {
      headers: { "User-Agent": "SnippetVault-Importer" },
      signal: AbortSignal.timeout(6000),
    });

    if (!fetchResponse.ok) {
      return NextResponse.json(
        { error: `Falha ao buscar conteúdo (Status ${fetchResponse.status})` },
        { status: 400 },
      );
    }

    const code = await fetchResponse.text();
    if (code.length > 25000) {
      return NextResponse.json(
        { error: "Arquivo excede o limite de tamanho permitido" },
        { status: 400 },
      );
    }

    const pathname = new URL(rawUrl).pathname;
    const filename = path.basename(pathname);
    const title = filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const extension = path.extname(pathname).toLowerCase().replace(".", "");
    const language = getLanguageFromExtension(extension);

    return NextResponse.json({
      title: title || "Imported Snippet",
      code,
      language,
      description: `Importado de: ${url}`,
      tags: ["import"],
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function isSafeUrl(urlStr: string): Promise<boolean> {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const allowedHosts = [
      "github.com",
      "raw.githubusercontent.com",
      "gist.github.com",
      "gist.githubusercontent.com",
    ];

    const hostname = url.hostname.toLowerCase();
    if (!allowedHosts.some((h) => hostname === h || hostname.endsWith("." + h))) {
      return false;
    }

    const { address } = await lookup(url.hostname);
    if (isPrivateIp(address)) return false;

    return true;
  } catch {
    return false;
  }
}

function isPrivateIp(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return true;
  const parts = ip.split(".").map(Number);
  if (parts.length === 4) {
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
  }
  return false;
}

function convertGithubUrlToRaw(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase();
    if (host === "github.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 5 && parts[2] === "blob") {
        const owner = parts[0];
        const repo = parts[1];
        const branch = parts[3];
        const filePath = parts.slice(4).join("/");
        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      }
    }
    return urlStr;
  } catch {
    return urlStr;
  }
}

function getLanguageFromExtension(ext: string): string {
  const mapping: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
    py: "Python",
    sh: "Bash",
    json: "JSON",
    html: "HTML",
    css: "CSS",
    md: "Markdown",
    rs: "Rust",
    go: "Go",
    cs: "C#",
    cpp: "C++",
    c: "C",
  };
  return mapping[ext] || "TypeScript";
}
