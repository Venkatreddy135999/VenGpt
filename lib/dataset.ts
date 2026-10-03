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

/**
 * Searches the knowledge base dataset for items relevant to user prompt.
 * Scores matches based on keywords and topic overlap.
 */
export function findRelevantKnowledge(query: string, maxResults = 2): KnowledgeItem[] {
  if (!query || typeof query !== "string") return [];

  const tokens = query.toLowerCase().split(/\W+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored = KNOWLEDGE_DATASET.map((item) => {
    let score = 0;
    const itemTokens = [
      ...item.keywords,
      ...item.topic.toLowerCase().split(/\W+/),
      ...item.category.toLowerCase().split(/\W+/),
    ];

    for (const token of tokens) {
      if (token.length < 3) continue;
      for (const k of itemTokens) {
        if (k.includes(token) || token.includes(k)) {
          score += 1;
        }
      }
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.item);
}

/**
 * Formats retrieved dataset items into a clean context prompt for the AI.
 */
export function formatKnowledgeContext(items: KnowledgeItem[]): string {
  if (items.length === 0) return "";

  const formatted = items
    .map(
      (item) =>
        `### Knowledge Reference: ${item.topic} (${item.category})\n- Summary: ${item.summary}\n- Key Details: ${item.details}`
    )
    .join("\n\n");

  return `\n\n[Verified Dataset Context]:\n${formatted}\nUse the above verified facts to ground and enrich your answer if relevant.`;
}
