import { AITool, ToolResult, UserRequest } from "./types";
import { ImageGenerationTool } from "./ImageGenerationTool";
import { CalculatorTool } from "./CalculatorTool";
import { CurrentInfoTool } from "./CurrentInfoTool";
import { CodingTool } from "./CodingTool";
import { ContextualFollowupTool } from "./ContextualFollowupTool";
import { TextRewriterTool, SummarizerTool, ExplanationTool } from "./TextTools";
import { RAGKnowledgeTool } from "./RAGKnowledgeTool";

export * from "./types";
export * from "./ImageGenerationTool";
export * from "./CalculatorTool";
export * from "./CurrentInfoTool";
export * from "./CodingTool";
export * from "./ContextualFollowupTool";
export * from "./TextTools";
export * from "./RAGKnowledgeTool";

// Instantiated tool registry
export const REGISTERED_TOOLS: AITool[] = [
  new ContextualFollowupTool(),
  new ImageGenerationTool(),
  new CalculatorTool(),
  new CurrentInfoTool(),
  new RAGKnowledgeTool(),
  new CodingTool(),
  new ExplanationTool(),
  new TextRewriterTool(),
  new SummarizerTool(),
];

/**
 * Evaluates registered tools against the incoming user request.
 * Returns the highest-priority matching tool or null for general LLM fallback.
 */
export function findToolForRequest(request: UserRequest): AITool | null {
  for (const tool of REGISTERED_TOOLS) {
    if (tool.canHandle(request)) {
      return tool;
    }
  }
  return null;
}
