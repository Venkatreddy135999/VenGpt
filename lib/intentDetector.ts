export type UserIntent =
  | "general_conversation"
  | "coding"
  | "explanation"
  | "mathematics"
  | "web_search"
  | "current_information"
  | "image_generation"
  | "image_editing"
  | "file_analysis"
  | "text_rewriting"
  | "translation"
  | "summarization"
  | "data_analysis"
  | "code_explanation"
  | "contextual_followup";

export interface IntentDetectionResult {
  intent: UserIntent;
  confidence: number;
  extractedEntities: {
    imagePrompt?: string;
    mathExpression?: string;
    programmingLanguage?: string;
    searchQuery?: string;
    targetLanguage?: string;
    codeSnippet?: string;
    contextReference?: string;
  };
}

/**
 * Robust Intent Detector that classifies user messages before routing.
 * Does not expose internal intent labels to the user unless debugging is enabled.
 */
export function detectUserIntent(
  userPrompt: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): IntentDetectionResult {
  const prompt = userPrompt.trim();
  const lower = prompt.toLowerCase();

  // 1. Image Generation Intent
  // Matches: "create an image of...", "generate an image of...", "make a picture of...", "draw...",
  // "create a photo...", "generate a portrait...", "make an image...", "create a image of virat kohli image4", etc.
  const imageGenPatterns = [
    /^(create|generate|make|produce|render|paint|draw)\s+(an?|the)?\s*(image|picture|photo|photograph|portrait|illustration|wallpaper|graphic|artwork|visual|sketch|drawing)\s+(of|with|for|about|depicting)?\s*(.*)/i,
    /^(draw|sketch|paint)\s+(me\s+)?(an?|the)?\s*(.*)/i,
    /^(generate|create)\s+(a\s+)?(futuristic|realistic|digital\s+art|portrait|landscape|3d|scifi|anime|cinematic|cyberpunk)\s+(.*)/i,
    /image\s+generation/i,
  ];

  for (const pattern of imageGenPatterns) {
    if (pattern.test(prompt)) {
      let extracted = prompt
        .replace(/^(create|generate|make|draw|paint|sketch)\s+(me\s+)?(an?|the)?\s*(image|picture|photo|portrait|illustration|artwork|visual|graphic)?\s*(of|with|for|about|depicting)?\s*/i, "")
        .trim();
      // Clean trailing noise like "image4" or "image 4"
      extracted = extracted.replace(/\bimage\s*\d+\b/gi, "").trim();
      if (!extracted) extracted = prompt;

      return {
        intent: "image_generation",
        confidence: 0.95,
        extractedEntities: {
          imagePrompt: extracted,
        },
      };
    }
  }

  // Also catch direct image prompts like "generate a futuristic city at night"
  if (/^generate\s+(an?|the)?\s+[a-z\s]+(city|car|scene|view|landscape|wallpaper|building|robot|night|space)/i.test(prompt)) {
    const extracted = prompt.replace(/^generate\s+(an?|the)?\s*/i, "").trim();
    return {
      intent: "image_generation",
      confidence: 0.92,
      extractedEntities: {
        imagePrompt: extracted,
      },
    };
  }

  // 2. Image Editing Intent
  if (/^(edit|modify|change|retouch|filter|colorize)\s+(this|the)?\s*(image|photo|picture)/i.test(lower)) {
    return {
      intent: "image_editing",
      confidence: 0.9,
      extractedEntities: {},
    };
  }

  // 3. Contextual Follow-up Intent
  // Words like "make it hollow", "change that to...", "add comments to it", "now in python"
  // when referring to previous conversation context.
  const lastAssistantMsg = [...conversationHistory].reverse().find((m) => m.role === "assistant");
  if (lastAssistantMsg && (/^(make\s+it\b|do\s+it\b|change\s+it\b|now\s+do\b|now\s+in\b|convert\s+it\b|modify\s+it\b|make\s+the\s+[a-z]+\s+hollow\b|add\s+comments\b|optimize\s+it\b|make\s+it\s+faster\b)/i.test(lower))) {
    return {
      intent: "contextual_followup",
      confidence: 0.94,
      extractedEntities: {
        contextReference: lastAssistantMsg.content,
      },
    };
  }

  // 4. Mathematics Intent
  // E.g., "What is 125 * 37?", "calculate 500 / 4", "solve 2x + 10 = 30", "sqrt(144)"
  const mathExprPattern = /(?:what\s+is\s+|calculate\s+|compute\s+|evaluate\s+)?(\b\d+(?:\.\d+)?\s*[\+\-\*\/\^\%×÷]\s*\d+(?:\.\d+)?(?:\s*[\+\-\*\/\^\%×÷]\s*\d+(?:\.\d+)?)*\b)/i;
  const mathMatch = prompt.match(mathExprPattern);
  if (mathMatch && (/[\+\-\*\/\^×÷]/.test(mathMatch[1]) || /^\d+\s*[\+\-\*\/]/.test(lower))) {
    return {
      intent: "mathematics",
      confidence: 0.96,
      extractedEntities: {
        mathExpression: mathMatch[1].replace(/×/g, "*").replace(/÷/g, "/"),
      },
    };
  }
  if (/^(calculate|solve|evaluate|compute)\b/i.test(lower) && /\d/.test(prompt)) {
    return {
      intent: "mathematics",
      confidence: 0.92,
      extractedEntities: {
        mathExpression: prompt.replace(/^(calculate|solve|evaluate|compute)\s+/i, ""),
      },
    };
  }

  // 5. Code Explanation Intent
  // E.g., "Explain this code: [Java code]" or "What does this code do?"
  if (/^(explain\s+this\s+code|explain\s+code|what\s+does\s+this\s+code\s+do|walk\s+through\s+this\s+code)\b/i.test(lower) || (lower.startsWith("explain") && /```|class\s+\w+|def\s+\w+|function\s+\w+/.test(prompt))) {
    const codeSnippet = prompt.replace(/^(explain\s+this\s+code\s*:?|explain\s+code\s*:?)/i, "").trim();
    return {
      intent: "code_explanation",
      confidence: 0.95,
      extractedEntities: {
        codeSnippet,
      },
    };
  }

  // 6. Text Rewriting Intent
  // E.g., "Rewrite this message professionally", "make this formal", "rephrase this"
  if (/^(rewrite|rephrase|paraphrase|polish|make\s+this\s+more|improve\s+this\s+text)\b/i.test(lower)) {
    return {
      intent: "text_rewriting",
      confidence: 0.93,
      extractedEntities: {},
    };
  }

  // 7. Summarization Intent
  // E.g., "Summarize this document", "give me a summary of...", "tldr"
  if (/^(summarize|give\s+a\s+summary|tldr|brief\s+summary|sum\s+up)\b/i.test(lower)) {
    return {
      intent: "summarization",
      confidence: 0.94,
      extractedEntities: {},
    };
  }

  // 8. Translation Intent
  // E.g., "Translate to French", "translate into Spanish"
  const translateMatch = lower.match(/^(translate|how\s+do\s+you\s+say)\s+(.*)\s+(to|in|into)\s+([a-z]+)/i);
  if (translateMatch || /^(translate\s+this|translate:)/i.test(lower)) {
    return {
      intent: "translation",
      confidence: 0.95,
      extractedEntities: {
        targetLanguage: translateMatch ? translateMatch[4] : undefined,
      },
    };
  }

  // 9. Current Information / Web Search Intent
  // Matches terms: latest, today, current, now, recent, live, score, price, news, odi record, world cup record
  const currentInfoKeywords = [
    "latest", "today", "current", "currently", "now", "recent", "recently",
    "live", "current score", "current price", "current news", "who has scored the most runs",
    "most runs in odi", "odi batting record", "highest run scorer", "cricket record"
  ];
  const hasCurrentInfoKeyword = currentInfoKeywords.some((kw) => lower.includes(kw));

  if (
    hasCurrentInfoKeyword ||
    /^(who\s+has\s+the\s+most\s+runs|who\s+scored\s+the\s+most\s+runs|what\s+is\s+the\s+latest|who\s+won\s+the\s+latest|what\s+is\s+the\s+current)/i.test(lower) ||
    /^(search\s+for|search\s+web|look\s+up|google)\b/i.test(lower)
  ) {
    return {
      intent: "current_information",
      confidence: 0.93,
      extractedEntities: {
        searchQuery: prompt,
      },
    };
  }

  // 10. Coding / Programming Intent
  // E.g., "Give me a Java star pattern", "java star pattern", "write a python function", "how to implement..."
  if (
    /^(give\s+me\s+a\s+)?java\s+(star\s+pattern|pattern|program|code)/i.test(lower) ||
    /star\s+pattern/i.test(lower) ||
    /pyramid\s+pattern/i.test(lower) ||
    /diamond\s+pattern/i.test(lower) ||
    /\b(write|create|implement|code)\s+(a\s+)?(function|class|method|component|script|algorithm|loop|pattern|query|program)\b/i.test(lower) ||
    /\b(in\s+java|in\s+python|in\s+typescript|in\s+javascript|in\s+c\+\+|in\s+sql|in\s+rust|in\s+go)\b/i.test(lower)
  ) {
    let lang = "java";
    if (/python/i.test(lower)) lang = "python";
    else if (/typescript|ts\b/i.test(lower)) lang = "typescript";
    else if (/javascript|js\b/i.test(lower)) lang = "javascript";
    else if (/c\+\+/i.test(lower)) lang = "cpp";
    else if (/sql/i.test(lower)) lang = "sql";

    return {
      intent: "coding",
      confidence: 0.95,
      extractedEntities: {
        programmingLanguage: lang,
      },
    };
  }

  // 11. Explanation / Learning Intent
  // E.g., "What is Java polymorphism?", "how does photosynthesis work?", "explain..."
  if (/^(what\s+is|explain|how\s+does|teach\s+me|why\s+does|concept\s+of)\b/i.test(lower)) {
    return {
      intent: "explanation",
      confidence: 0.92,
      extractedEntities: {},
    };
  }

  // 12. General Conversation
  // E.g., "Hello", "Hi", "Good morning", "Who are you?", etc.
  if (
    /^(hello|hi|hey|howdy|greetings|good\s+(morning|afternoon|evening)|how\s+are\s+you|who\s+are\s+you)/i.test(lower) ||
    lower.length < 15
  ) {
    return {
      intent: "general_conversation",
      confidence: 0.88,
      extractedEntities: {},
    };
  }

  // Default to General Conversation / LLM
  return {
    intent: "general_conversation",
    confidence: 0.75,
    extractedEntities: {},
  };
}
