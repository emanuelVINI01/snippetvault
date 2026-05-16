import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import c from "react-syntax-highlighter/dist/cjs/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/cjs/languages/prism/cpp";
import csharp from "react-syntax-highlighter/dist/cjs/languages/prism/csharp";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import dart from "react-syntax-highlighter/dist/cjs/languages/prism/dart";
import docker from "react-syntax-highlighter/dist/cjs/languages/prism/docker";
import elixir from "react-syntax-highlighter/dist/cjs/languages/prism/elixir";
import go from "react-syntax-highlighter/dist/cjs/languages/prism/go";
import graphql from "react-syntax-highlighter/dist/cjs/languages/prism/graphql";
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import kotlin from "react-syntax-highlighter/dist/cjs/languages/prism/kotlin";
import lua from "react-syntax-highlighter/dist/cjs/languages/prism/lua";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import markup from "react-syntax-highlighter/dist/cjs/languages/prism/markup";
import php from "react-syntax-highlighter/dist/cjs/languages/prism/php";
import powershell from "react-syntax-highlighter/dist/cjs/languages/prism/powershell";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import r from "react-syntax-highlighter/dist/cjs/languages/prism/r";
import ruby from "react-syntax-highlighter/dist/cjs/languages/prism/ruby";
import rust from "react-syntax-highlighter/dist/cjs/languages/prism/rust";
import sass from "react-syntax-highlighter/dist/cjs/languages/prism/sass";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import swift from "react-syntax-highlighter/dist/cjs/languages/prism/swift";
import toml from "react-syntax-highlighter/dist/cjs/languages/prism/toml";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/cjs/languages/prism/yaml";

const registeredLanguages = {
  bash,
  c,
  cpp,
  csharp,
  css,
  dart,
  docker,
  elixir,
  go,
  graphql,
  java,
  javascript,
  json,
  jsx,
  kotlin,
  lua,
  markdown,
  markup,
  php,
  powershell,
  python,
  r,
  ruby,
  rust,
  sass,
  scss,
  sql,
  swift,
  toml,
  tsx,
  typescript,
  yaml,
};

Object.entries(registeredLanguages).forEach(([name, language]) => {
  SyntaxHighlighter.registerLanguage(name, language);
});

const LANGUAGE_ALIASES: Record<string, string> = {
  angular: "typescript",
  cs: "csharp",
  "c#": "csharp",
  "c++": "cpp",
  dockerfile: "docker",
  html: "markup",
  md: "markdown",
  next: "tsx",
  "next.js": "tsx",
  nextjs: "tsx",
  postgres: "sql",
  postgresql: "sql",
  ps1: "powershell",
  react: "tsx",
  sh: "bash",
  shell: "bash",
  svelte: "markup",
  tailwind: "css",
  ts: "typescript",
  tsx: "tsx",
  vue: "markup",
  xml: "markup",
  yaml: "yaml",
  yml: "yaml",
  zsh: "bash",
};

export function normalizeSnippetLanguage(language = "") {
  const key = language.trim().toLowerCase();
  const compactKey = key.replace(/\s+/g, "").replace(/_/g, "-");

  return LANGUAGE_ALIASES[key] ?? LANGUAGE_ALIASES[compactKey] ?? (compactKey || "text");
}

export { dracula, SyntaxHighlighter };
