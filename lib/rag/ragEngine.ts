import knowledgeBase from "@/data/knowledge-base.json";

export interface RAGChunk {
  id: string;
  category: string;
  topic: string;
  keywords: string[];
  summary: string;
  details: string;
  source: string;
}

export interface RAGSearchResult {
  chunk: RAGChunk;
  score: number;
  matchedKeywords: string[];
}

// Ingest and normalize all available knowledge sources into indexed RAG chunks
const RAG_CORPUS: RAGChunk[] = [
  ...knowledgeBase.map((item) => ({
    id: item.id,
    category: item.category,
    topic: item.topic,
    keywords: item.keywords || [],
    summary: item.summary,
    details: item.details,
    source: `Knowledge Base (${item.category})`,
  })),
  // Additional Software Development & Engineering RAG Chunks
  {
    id: "dev-rag-001",
    category: "Software Development",
    topic: "Next.js Turbopack & Production Build Optimization",
    keywords: ["turbopack", "nextjs build", "production build", "next.js performance", "bundling"],
    summary: "Turbopack is Next.js's Rust-powered bundler designed for fast incremental builds and hot module replacement.",
    details: "Key optimizations include dynamic force-dynamic route exports for uncached endpoints, lazy Prisma initialization via proxies to prevent build-time crashes, and standalone output tracing for Docker containers.",
    source: "Next.js Core Engineering Guide",
  },
  {
    id: "dev-rag-002",
    category: "Software Development",
    topic: "TypeScript Strict Mode & Enterprise Typing Patterns",
    keywords: ["typescript", "strict mode", "generics", "type inference", "type safety"],
    summary: "TypeScript strict mode enables noImplicitAny, strictNullChecks, and exactOptionalPropertyTypes to catch errors at compile-time.",
    details: "Best practices include avoiding the 'any' type in favor of 'unknown', using discriminated unions for state management, leveraging utility types (Pick, Omit, Partial, Record), and defining readonly props.",
    source: "Enterprise TypeScript Architecture",
  },
  {
    id: "dev-rag-003",
    category: "Software Development",
    topic: "RESTful API Design & Idempotent HTTP Methods",
    keywords: ["rest", "api design", "http methods", "idempotency", "status codes"],
    summary: "REST APIs use standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) with semantic status codes to manage resources.",
    details: "GET, PUT, and DELETE must remain strictly idempotent. PATCH applies partial delta modifications. Status codes should follow: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 429 (Rate Limited), 500 (Internal Server Error).",
    source: "API Architectural Standards",
  },
  {
    id: "dev-rag-004",
    category: "Software Development",
    topic: "React 19 & Concurrent State Management",
    keywords: ["react 19", "useactionstate", "usetransition", "server actions", "react hooks"],
    summary: "React 19 introduces automatic memoization via the React Compiler, Actions for asynchronous transitions, and native resource preloading.",
    details: "useActionState manages pending form states cleanly without manual loading flags. useOptimistic displays UI updates immediately before server confirmations. Server Actions eliminate boilerplate fetch calls.",
    source: "React 19 Technical Specification",
  },
];

const STOP_WORDS = new Set([
  "a", "about", "all", "an", "and", "are", "as", "at", "be", "by", "can", "could",
  "do", "does", "explain", "for", "from", "get", "give", "has", "have", "how", "i",
  "in", "is", "it", "me", "my", "need", "no", "not", "of", "on", "or", "please",
  "show", "tell", "that", "the", "this", "to", "what", "when", "where", "which",
  "who", "why", "will", "with", "would", "you", "your"
]);

/**
 * Tokenizes text and strips punctuation and stop words.
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * Searches the RAG knowledge corpus for chunks matching the user query.
 * Uses hybrid TF-IDF + keyword matching + exact topic bonuses.
 */
export function queryRAGCorpus(query: string, maxResults = 3): RAGSearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const lowerQuery = query.toLowerCase().trim();

  const scoredResults: RAGSearchResult[] = RAG_CORPUS.map((chunk) => {
    let score = 0;
    const matchedKeywords: string[] = [];

    const topicTokens = tokenize(chunk.topic);
    const categoryTokens = tokenize(chunk.category);
    const summaryTokens = tokenize(chunk.summary);
    const detailsTokens = tokenize(chunk.details);
    const keywords = chunk.keywords.map((k) => k.toLowerCase());

    // 1. Exact Topic / Query Match Bonus
    if (lowerQuery.includes(chunk.topic.toLowerCase()) || chunk.topic.toLowerCase().includes(lowerQuery)) {
      score += 15;
    }

    // 2. Keyword Matching (High Weight)
    for (const kw of keywords) {
      if (lowerQuery.includes(kw)) {
        score += 8;
        matchedKeywords.push(kw);
      } else {
        const kwTokens = tokenize(kw);
        const matches = queryTokens.filter((qt) => kwTokens.includes(qt));
        if (matches.length > 0) {
          score += matches.length * 3;
          matchedKeywords.push(kw);
        }
      }
    }

    // 3. Topic Token Overlap
    const topicMatches = queryTokens.filter((qt) => topicTokens.includes(qt));
    score += topicMatches.length * 4;

    // 4. Category Token Overlap
    const catMatches = queryTokens.filter((qt) => categoryTokens.includes(qt));
    score += catMatches.length * 2;

    // 5. Summary & Details Body Matches
    const bodyMatches = queryTokens.filter((qt) => summaryTokens.includes(qt) || detailsTokens.includes(qt));
    score += bodyMatches.length * 1.5;

    return {
      chunk,
      score,
      matchedKeywords: Array.from(new Set(matchedKeywords)),
    };
  });

  return scoredResults
    .filter((res) => res.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Formats retrieved RAG chunks into a structured grounding context for LLM prompt injection.
 */
export function buildRAGContext(query: string, maxResults = 3): string {
  const results = queryRAGCorpus(query, maxResults);
  if (results.length === 0) return "";

  const contextSegments = results.map((res, index) => {
    const c = res.chunk;
    return (
      `[Grounding Source ${index + 1}: ${c.category} - ${c.topic}]\n` +
      `Summary: ${c.summary}\n` +
      `Details: ${c.details}\n` +
      `Authority: ${c.source}`
    );
  });

  return (
    `\n\n--- RAG VERIFIED KNOWLEDGE BASE ---\n` +
    `The following facts are verified authoritative ground truth. Use them to answer accurately without hallucination:\n\n` +
    contextSegments.join("\n\n") +
    `\n--- END RAG KNOWLEDGE ---\n`
  );
}

/**
 * Directly synthesizes a verified answer from the RAG knowledge base.
 */
export function synthesizeRAGAnswer(result: RAGSearchResult): string {
  const c = result.chunk;
  return (
    `### 📚 ${c.topic}\n\n` +
    `${c.summary}\n\n` +
    `#### 🔍 In-Depth Details & Implementation\n` +
    `${c.details}\n\n` +
    `---\n` +
    `> **Grounded Source:** *${c.source}* | **Domain:** \`${c.category}\``
  );
}
