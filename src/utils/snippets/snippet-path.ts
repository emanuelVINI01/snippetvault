const EXTENSION_BY_LANGUAGE: Record<string, string> = {
  typescript: "ts",
  javascript: "js",
  tsx: "tsx",
  jsx: "jsx",
  react: "tsx",
  python: "py",
  bash: "sh",
  shell: "sh",
  json: "json",
  html: "html",
  css: "css",
  scss: "scss",
  sass: "sass",
  markdown: "md",
  md: "md",
  rust: "rs",
  go: "go",
  java: "java",
  "c#": "cs",
  csharp: "cs",
  cpp: "cpp",
  "c++": "cpp",
  c: "c",
  php: "php",
  ruby: "rb",
  swift: "swift",
  kotlin: "kt",
  dart: "dart",
  sql: "sql",
  yaml: "yml",
  yml: "yml",
  toml: "toml",
  xml: "xml",
  dockerfile: "dockerfile",
  graphql: "graphql",
};

export function getFileExtension(language: string = ""): string {
  return EXTENSION_BY_LANGUAGE[language.toLowerCase().trim()] ?? "txt";
}

export function slugify(value: string, fallback = "item"): string {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

export function getSnippetFilePath(title: string, language: string): string {
  return `~/snippets/${slugify(title, "snippet")}.${getFileExtension(language)}`;
}

export function getPlaybookPath(title: string): string {
  return `~/playbooks/${slugify(title, "playbook")}`;
}
