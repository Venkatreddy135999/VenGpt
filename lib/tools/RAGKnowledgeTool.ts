import { AITool, ToolResult, UserRequest } from "./types";
import { queryRAGCorpus, synthesizeRAGAnswer } from "@/lib/rag/ragEngine";

export class RAGKnowledgeTool implements AITool {
  getName(): string {
    return "RAGKnowledgeTool";
  }

  getDescription(): string {
    return "Answers technical, architectural, software engineering, and verified domain questions using retrieval-augmented generation grounded in indexed datasets.";
  }

  canHandle(request: UserRequest): boolean {
    const prompt = request.prompt.trim();
    if (prompt.length < 3) return false;

    // Do not intercept arithmetic expressions or explicit image generation
    if (/^\d+\s*[\+\-\*\/]/.test(prompt) || /^(create|generate|draw|paint)\s+(an?|the)?\s*image/i.test(prompt)) {
      return false;
    }

    const matches = queryRAGCorpus(prompt, 1);
    if (matches.length > 0 && matches[0].score >= 6) {
      return true;
    }

    return false;
  }

  async execute(request: UserRequest): Promise<ToolResult> {
    const matches = queryRAGCorpus(request.prompt, 1);
    if (matches.length === 0) {
      return {
        type: "text",
        content: "No matching knowledge items were found in the RAG corpus.",
      };
    }

    const bestMatch = matches[0];
    const answer = synthesizeRAGAnswer(bestMatch);

    return {
      type: "text",
      content: answer,
      metadata: {
        isRAG: true,
        topic: bestMatch.chunk.topic,
        category: bestMatch.chunk.category,
        score: bestMatch.score,
        source: bestMatch.chunk.source,
      },
    };
  }
}
