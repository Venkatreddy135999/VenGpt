import knowledgeBase from "@/data/knowledge-base.json";
import promptLibrary from "@/data/prompt-library.json";

export interface KnowledgeItem {
  id: string;
  category: string;
  topic: string;
  keywords: string[];
  summary: string;
  details: string;
}

export interface PromptItem {
  id: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  for_devs?: boolean;
  type?: string;
  contributor?: string;
}

export const KNOWLEDGE_DATASET: KnowledgeItem[] = knowledgeBase;
export const PROMPT_DATASET: PromptItem[] = promptLibrary;

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "you", "are", "code",
  "what", "how", "why", "when", "can", "please", "help", "about", "your",
  "write", "give", "show", "tell", "make", "create", "need", "want", "like"
]);

/**
 * Searches the knowledge base dataset for items relevant to user prompt.
 * Only triggers on specific high-confidence technical terms, ignoring common stop words.
 */
export function findRelevantKnowledge(query: string, maxResults = 1): KnowledgeItem[] {
  if (!query || typeof query !== "string") return [];

  const tokens = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  if (tokens.length === 0) return [];

  const scored = KNOWLEDGE_DATASET.map((item) => {
    let score = 0;
    const itemKeywords = item.keywords.map((k) => k.toLowerCase());
    const topicTokens = item.topic.toLowerCase().split(/\W+/).filter(Boolean);
    const summaryTokens = item.summary.toLowerCase().split(/\W+/).filter(Boolean);

    for (const token of tokens) {
      if (itemKeywords.some((k) => k.includes(token) || token.includes(k))) {
        score += 3;
      }
      if (topicTokens.includes(token)) {
        score += 2;
      }
      if (summaryTokens.includes(token)) {
        score += 1;
      }
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.item);
}

/**
 * Formats retrieved dataset items into a concise context prompt for the AI.
 */
export function formatKnowledgeContext(items: KnowledgeItem[]): string {
  if (items.length === 0) return "";

  const formatted = items
    .map((item) => `[Topic: ${item.topic}] ${item.summary}`)
    .join(" ");

  return ` Note: ${formatted}`;
}
