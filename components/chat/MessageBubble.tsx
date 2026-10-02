"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot, Copy, Check, RotateCcw } from "lucide-react";
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
        "group flex w-full gap-3 py-4 px-2 sm:px-4 transition-colors",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-border flex items-center justify-center shrink-0 text-primary mt-0.5">
          <Bot className="h-4 w-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={cn(
          "flex flex-col max-w-[85%] sm:max-w-[78%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {isUser ? (
          /* User Message */
          <div className="rounded-2xl rounded-tr-xs px-4 py-2.5 bg-foreground text-background text-sm font-normal shadow-xs whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </div>
        ) : (
          /* AI Message with Markdown */
          <div className="w-full text-foreground text-sm font-normal leading-relaxed break-words">
            <div className="prose dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Code block rendering
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

              {/* Cursor blinking indicator while actively streaming */}
              {isStreaming && (
                <span className="inline-block h-4 w-1.5 ml-1 bg-primary animate-pulse align-middle" />
              )}
            </div>

            {/* Assistant message action bar */}
            {!isStreaming && content.length > 0 && (
              <div className="flex items-center gap-2 mt-2 pt-1 text-muted-foreground">
                <button
                  onClick={onCopy}
                  title="Copy response"
                  aria-label="Copy response"
                  className="flex items-center gap-1 text-xs hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>

                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    title="Regenerate response"
                    aria-label="Regenerate response"
                    className="flex items-center gap-1 text-xs hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Regenerate</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 text-muted-foreground mt-0.5">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
