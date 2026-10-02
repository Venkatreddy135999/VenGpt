"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, RotateCcw } from "lucide-react";
import { CodeBlock } from "@/components/chat/CodeBlock";
import { cn } from "@/lib/utils";

export interface MessageProps {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  isLast?: boolean;
  onRegenerate?: () => void;
}

export function MessageBubble({
  id,
  role,
  content,
  isStreaming = false,
  isLast = false,
  onRegenerate,
}: MessageProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = role === "user";

  const onCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex w-full py-3 px-2 sm:px-4 transition-colors",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          isUser ? "items-end max-w-[85%] sm:max-w-[70%]" : "items-start w-full max-w-3xl"
        )}
      >
        {isUser ? (
          /* User Message - ChatGPT Rounded Pill Style */
          <div className="rounded-3xl px-5 py-2.5 bg-muted/80 dark:bg-[#303030] text-foreground text-sm font-normal shadow-2xs whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </div>
        ) : (
          /* AI Message - ChatGPT Clean Prose Layout */
          <div className="w-full text-foreground text-[15px] font-normal leading-relaxed break-words">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (!inline && (match || codeString.includes("\n"))) {
                      return (
                        <CodeBlock
                          language={match ? match[1] : undefined}
                          value={codeString}
                        />
                      );
                    }

                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline underline-offset-2 hover:text-blue-600"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>

              {/* Blinking cursor while actively streaming */}
              {isStreaming && (
                <span className="inline-block h-4 w-1.5 ml-1 bg-foreground animate-pulse align-middle" />
              )}
            </div>

            {/* ChatGPT Action Buttons Bar */}
            {!isStreaming && content.length > 0 && (
              <div className="flex items-center gap-1 mt-3 pt-1 text-muted-foreground">
                <button
                  onClick={onCopy}
                  title="Copy"
                  aria-label="Copy to clipboard"
                  className="p-1.5 rounded-md hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>

                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    title="Regenerate"
                    aria-label="Regenerate response"
                    className="p-1.5 rounded-md hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
