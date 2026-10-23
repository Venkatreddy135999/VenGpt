"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  RotateCcw,
  Download,
  ExternalLink,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
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

interface ImagePayload {
  type: "image";
  url: string;
  alt?: string;
  prompt?: string;
  caption?: string;
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
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const isUser = role === "user";

  // Check if content represents an image message (Requirement 11)
  const imagePayload: ImagePayload | null = React.useMemo(() => {
    if (!content || typeof content !== "string") return null;
    const trimmed = content.trim();
    if (trimmed.startsWith("{") && trimmed.includes('"type"') && trimmed.includes('"image"')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.type === "image" && parsed.url) {
          return parsed as ImagePayload;
        }
      } catch {}
    }
    return null;
  }, [content]);

  // While streaming an image payload, show a clean indicator instead of raw JSON
  const isImageStreaming = isStreaming && content.trim().startsWith('{"type":"image"');

  const onCopy = async () => {
    if (!content) return;
    const textToCopy = imagePayload ? imagePayload.url : content;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async (url: string, filename: string = "vengpt-image.jpg") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting symbols for natural voice synthesis
    const plainText = content
      .replace(/[*_#`~>\[\]\(\)]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    if (!plainText) return;

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
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
        ) : isImageStreaming ? (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-muted/40 border border-border/50 text-sm text-muted-foreground animate-pulse">
            <ImageIcon className="h-5 w-5 text-indigo-500 animate-pulse" />
            <span>VenGPT is generating your high-resolution image...</span>
          </div>
        ) : imagePayload ? (
          /* Image Message Card (Requirement 11) */
          <div className="w-full max-w-xl flex flex-col space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm transition-all hover:shadow-md">
              {!imgLoaded && (
                <div className="flex h-72 w-full items-center justify-center bg-muted/50 animate-pulse text-muted-foreground text-sm">
                  <ImageIcon className="h-6 w-6 mr-2 animate-bounce" />
                  Rendering high-resolution image...
                </div>
              )}
              <img
                src={imagePayload.url}
                alt={imagePayload.alt || "VenGPT Generated Image"}
                onLoad={() => setImgLoaded(true)}
                className={cn(
                  "w-full max-h-[512px] object-cover transition-opacity duration-300",
                  imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                )}
              />
            </div>

            {/* Prompt and metadata footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span className="font-medium text-foreground truncate max-w-[65%]">
                {imagePayload.prompt || imagePayload.alt || "VenGPT Artwork"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownloadImage(imagePayload.url, `${(imagePayload.prompt || "image").slice(0, 20)}.jpg`)}
                  title="Download Image"
                  className="p-1.5 rounded-md hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>

                <a
                  href={imagePayload.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Original"
                  className="p-1.5 rounded-md hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  onClick={onCopy}
                  title="Copy Image URL"
                  className="p-1.5 rounded-md hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AI Text Message - ChatGPT Clean Prose Layout */
          <div className="w-full text-foreground text-[15px] font-normal leading-relaxed break-words">
            {!isUser && (content.includes("Grounded Source:") || content.includes("RAG VERIFIED") || content.includes("Verified Information") || content.includes("ICC Official Records")) && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 select-none">
                <Sparkles className="h-3 w-3" />
                <span>RAG Grounded Intelligence</span>
              </div>
            )}
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
                  img({ src, alt }) {
                    return (
                      <div className="my-3 overflow-hidden rounded-xl border border-border shadow-sm">
                        <img
                          src={src}
                          alt={alt || "Image"}
                          className="w-full max-h-[500px] object-cover"
                          loading="lazy"
                        />
                      </div>
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
              <div className="flex items-center gap-1 mt-3 pt-1 text-muted-foreground select-none">
                {/* Copy */}
                <button
                  onClick={onCopy}
                  title="Copy to clipboard"
                  aria-label="Copy to clipboard"
                  className="p-1.5 rounded-md hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Read aloud (Speech) */}
                <button
                  onClick={handleSpeak}
                  title={isSpeaking ? "Stop reading aloud" : "Read aloud"}
                  aria-label="Read aloud"
                  className={`p-1.5 rounded-md hover:bg-muted/70 transition-colors cursor-pointer text-xs ${
                    isSpeaking ? "text-primary bg-primary/10" : "hover:text-foreground"
                  }`}
                >
                  {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>

                {/* Thumbs up */}
                <button
                  onClick={() => setFeedback(feedback === "up" ? null : "up")}
                  title="Good response"
                  aria-label="Good response"
                  className={`p-1.5 rounded-md hover:bg-muted/70 transition-colors cursor-pointer text-xs ${
                    feedback === "up" ? "text-emerald-500" : "hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>

                {/* Thumbs down */}
                <button
                  onClick={() => setFeedback(feedback === "down" ? null : "down")}
                  title="Bad response"
                  aria-label="Bad response"
                  className={`p-1.5 rounded-md hover:bg-muted/70 transition-colors cursor-pointer text-xs ${
                    feedback === "down" ? "text-rose-500" : "hover:text-foreground"
                  }`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>

                {/* Regenerate response */}
                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    title="Regenerate response"
                    aria-label="Regenerate response"
                    className="p-1.5 rounded-md hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer text-xs flex items-center gap-1 ml-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
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
