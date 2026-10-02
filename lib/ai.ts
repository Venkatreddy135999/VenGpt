export const DEFAULT_SYSTEM_PROMPT =
  "You are AI Assistant, a helpful, accurate, and friendly AI assistant. Answer questions clearly and concisely. Explain difficult concepts step by step when useful. Do not invent facts. If you are uncertain, clearly state your uncertainty. Use Markdown formatting when it improves readability. When providing code, use appropriate fenced code blocks with the programming language specified.";

export interface ModelOption {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast, intelligent, and cost-effective for daily tasks",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Flagship omni-model for complex reasoning and coding",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "High-intelligence model with deep domain knowledge",
  },
];

export function cleanTitleFromMessage(content: string): string {
  if (!content) return "New Conversation";

  // Strip leading punctuation/quotes/markdown
  let title = content
    .replace(/^[#*`"'>\s-]+/, "")
    .replace(/^please\s+/i, "")
    .trim();

  // Get first line or sentence
  const firstLine = title.split(/\r?\n/)[0];
  if (firstLine) {
    title = firstLine;
  }

  // Capitalize first character
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  // Trim to 50 characters cleanly on word boundary if possible
  if (title.length > 48) {
    const truncated = title.slice(0, 48);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 20) {
      title = truncated.slice(0, lastSpace) + "...";
    } else {
      title = truncated + "...";
    }
  }

  return title || "New Conversation";
}
