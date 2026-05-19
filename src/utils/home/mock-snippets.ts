const MOCK_LANGUAGE_CLASSES: Record<string, string> = {
  Bash: "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  CSS: "text-dracula-red bg-dracula-red/10 border-dracula-red/30",
  Go: "text-dracula-cyan bg-dracula-cyan/10 border-dracula-cyan/30",
  Python: "text-dracula-green bg-dracula-green/10 border-dracula-green/30",
  SQL: "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  TypeScript: "text-dracula-cyan bg-dracula-cyan/10 border-dracula-cyan/30",
};

export function getMockLanguageClass(language: string): string {
  return MOCK_LANGUAGE_CLASSES[language] ?? "border-dracula-card text-dracula-comment";
}
