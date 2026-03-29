/**
 * Dracula-themed language colors for snippet cards.
 * Combines Tailwind classes for text color, background (with opacity), and border.
 */

export const LANG_COLORS: Record<string, string> = {
  // Web & JavaScript Ecosystem
  typescript:  "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  javascript:  "text-dracula-green  bg-dracula-green/10  border-dracula-green/30",
  react:       "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  jsx:         "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  tsx:         "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  nextjs:      "text-dracula-fg     bg-dracula-fg/10     border-dracula-fg/30",
  angular:     "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  vue:         "text-dracula-green  bg-dracula-green/10  border-dracula-green/30",
  svelte:      "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  html:        "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  css:         "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  scss:        "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  sass:        "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  tailwind:    "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",

  // Systems & Backend
  python:      "text-dracula-green  bg-dracula-green/10  border-dracula-green/30",
  go:          "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  rust:        "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  csharp:      "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  "c#":        "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  cpp:         "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  "c++":       "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  c:           "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  java:        "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  php:         "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  ruby:        "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  swift:       "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  kotlin:      "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  dart:        "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  elixir:      "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",

  // Data, AI & Scripting
  sql:         "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  r:           "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  bash:        "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  shell:       "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  powershell:  "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  lua:         "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",

  // Data Formats & Config
  json:        "text-dracula-green  bg-dracula-green/10  border-dracula-green/30",
  yaml:        "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  yml:         "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  toml:        "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  xml:         "text-dracula-red    bg-dracula-red/10    border-dracula-red/30",
  markdown:    "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  md:          "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  dockerfile:  "text-dracula-cyan   bg-dracula-cyan/10   border-dracula-cyan/30",
  graphql:     "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
};

/**
 * Gets the Tailwind CSS utility classes for a given language.
 * Defaults to a comment-colored style if the language is unknown.
 */
export function getLanguageColor(lang: string = ""): string {
  const key = lang.toLowerCase().trim();
  return LANG_COLORS[key] ?? "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30";
}

export const COMMON_LANGUAGES = [
  "TypeScript", "JavaScript", "React", "Angular", "Vue", "Svelte",
  "Python", "Go", "Rust", "C#", "C++", "C", "Java", "PHP", "Ruby",
  "Swift", "Kotlin", "Dart", "R", "SQL", "Bash", "Shell", "JSON",
  "YAML", "HTML", "CSS", "SCSS", "Markdown",
];
