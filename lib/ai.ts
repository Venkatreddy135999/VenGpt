export const DEFAULT_SYSTEM_PROMPT =
  "You are VenGPT, an intelligent, articulate, and accurate AI assistant designed with modern ChatGPT-style reasoning and capability routing. Answer questions clearly and concisely. Explain difficult concepts step by step when useful. Never hallucinate facts. Use Markdown formatting when it improves readability. When providing code, use appropriate fenced code blocks with the programming language specified.";

export interface ModelOption {
  id: string;
  name: string;
  provider: "OpenAI" | "DeepSeek" | "xAI (Grok)" | "Anthropic" | "Google" | "Open Source / Astra";
  description: string;
  badge?: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  // VenGPT / OpenAI Models
  {
    id: "gpt-4o",
    name: "VenGPT 4o",
    provider: "OpenAI",
    description: "Flagship omni-model for complex reasoning, math, and code",
    badge: "Flagship",
  },
  {
    id: "gpt-4o-mini",
    name: "VenGPT 4o Mini",
    provider: "OpenAI",
    description: "Fast, intelligent, and cost-efficient for everyday tasks",
    badge: "Fast",
  },
  {
    id: "o1",
    name: "VenGPT o1",
    provider: "OpenAI",
    description: "Breakthrough reasoning model for deep science, coding, and math",
    badge: "Reasoning",
  },
  {
    id: "o1-mini",
    name: "VenGPT o1 Mini",
    provider: "OpenAI",
    description: "Fast reasoning model tailored for math and coding problem solving",
    badge: "Reasoning",
  },
  {
    id: "o3-mini",
    name: "VenGPT o3 Mini",
    provider: "OpenAI",
    description: "Next-generation high-efficiency reasoning model",
    badge: "New",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "High-intelligence model with deep domain understanding",
  },

  // DeepSeek Models
  {
    id: "deepseek-reasoner",
    name: "DeepSeek-R1",
    provider: "DeepSeek",
    description: "Frontier open reasoning model with transparent chain-of-thought",
    badge: "Reasoning",
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek-V3",
    provider: "DeepSeek",
    description: "State-of-the-art 671B MoE model for general conversation and analysis",
    badge: "Popular",
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    description: "Specialized model for code generation, refactoring, and debugging",
  },

  // xAI Grok Models
  {
    id: "grok-2",
    name: "Grok-2",
    provider: "xAI (Grok)",
    description: "Frontier real-time intelligence with witty, direct reasoning",
    badge: "xAI",
  },
  {
    id: "grok-2-mini",
    name: "Grok-2 Mini",
    provider: "xAI (Grok)",
    description: "Ultra-fast Grok model balancing reasoning and speed",
  },
  {
    id: "grok-beta",
    name: "Grok Beta",
    provider: "xAI (Grok)",
    description: "Experimental frontier model from xAI",
  },

  // Anthropic Claude Models
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Industry benchmark for coding, writing, and analytical depth",
    badge: "Top Tier",
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    description: "Near-instantaneous speed with high intelligence",
  },

  // Google Gemini Models
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Next-gen lightning-fast multimodal reasoning model",
    badge: "Fast",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Massive context window with advanced multi-document reasoning",
  },

  // Astra & Open Source Models
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Open Source / Astra",
    description: "Meta's flagship open-weights model rivaling proprietary giants",
    badge: "Open Weights",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Open Source / Astra",
    description: "Top-tier European reasoning and multilingual model",
  },
];

export function getModelById(modelId: string): ModelOption {
  return (
    AVAILABLE_MODELS.find((m) => m.id === modelId) || {
      id: modelId,
      name: modelId,
      provider: "OpenAI",
      description: "Custom AI Model",
    }
  );
}

export function cleanTitleFromMessage(content: string): string {
  if (!content) return "New Conversation";

  let title = content
    .replace(/^[#*`"'>\s-]+/, "")
    .replace(/^please\s+/i, "")
    .trim();

  const firstLine = title.split(/\r?\n/)[0];
  if (firstLine) {
    title = firstLine;
  }

  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

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
