"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import Prism from "prismjs";

// Import common syntax highlighters
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";

interface CodeBlockProps {
  language?: string;
  value: string;
}

const LANGUAGE_MAP: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  py: "python",
  python: "python",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  json: "json",
  sql: "sql",
  css: "css",
  html: "markup",
  xml: "markup",
  md: "markdown",
  markdown: "markdown",
  yaml: "yaml",
  yml: "yaml",
  rs: "rust",
  rust: "rust",
  go: "go",
  golang: "go",
};

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizedLang = (language || "").toLowerCase().trim();
  const canonicalLang = LANGUAGE_MAP[normalizedLang] || normalizedLang;
  const displayLang = language || "text";

  const highlightedHtml = React.useMemo(() => {
    if (!value) return "";
    try {
      if (canonicalLang && Prism.languages[canonicalLang]) {
        return Prism.highlight(value, Prism.languages[canonicalLang], canonicalLang);
      }
    } catch {
      // Fallback to plain text on any error
    }
    return null;
  }, [value, canonicalLang]);

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-zinc-800 bg-[#18181b] text-zinc-100 font-mono text-[13px] shadow-md">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#202023] border-b border-zinc-800 text-zinc-400">
        <span className="text-[11px] font-semibold tracking-wider lowercase text-zinc-300">
          {displayLang}
        </span>
        <button
          onClick={onCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors py-0.5 px-2 rounded hover:bg-zinc-700/50 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px] font-sans">Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-zinc-100 leading-relaxed font-mono">
        {highlightedHtml ? (
          <pre className="m-0 p-0 font-mono">
            <code
              className={`language-${canonicalLang} font-mono`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </pre>
        ) : (
          <pre className="m-0 p-0 font-mono">
            <code className="font-mono">{value}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
