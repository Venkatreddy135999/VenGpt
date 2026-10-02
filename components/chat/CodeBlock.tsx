"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language?: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language || "text";

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-border/80 bg-zinc-900 text-zinc-100 font-mono text-xs shadow-sm">
      <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-950/80 border-b border-zinc-800 text-zinc-400">
        <span className="text-[11px] font-medium uppercase tracking-wider">
          {displayLang}
        </span>
        <button
          onClick={onCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-1 px-1.5 rounded cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-zinc-100 leading-relaxed font-mono">
        <pre className="m-0 p-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
