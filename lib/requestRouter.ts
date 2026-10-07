import { detectUserIntent, IntentDetectionResult } from "./intentDetector";
import { findToolForRequest, UserRequest, ToolResult, AITool } from "./tools";
import { generateContextualResponse } from "./conversationalResponder";

export interface RoutedResponse {
  intent: string;
  toolUsed?: string;
  isImageMessage: boolean;
  rawResult: ToolResult | null;
  outputPayload: string; // JSON string for image or formatted markdown string for text
}

export interface RouteOptions {
  webSearch?: boolean;
}

/**
 * Central Request Router coordinating Intent Detection, Tool Execution,
 * Context Tracking, and Output Formatting in ChatGPT style.
 */
export async function routeUserRequest(
  prompt: string,
  conversationHistory: Array<{ role: "user" | "assistant" | "system"; content: string }> = [],
  modelId: string = "gpt-4o-mini",
  options?: RouteOptions
): Promise<RoutedResponse> {
  // 1. Detect Intent (or force web_search if explicitly toggled by user)
  const intentResult: IntentDetectionResult = options?.webSearch
    ? {
        intent: "current_information",
        confidence: 1.0,
        extractedEntities: { searchQuery: prompt },
      }
    : detectUserIntent(prompt, conversationHistory);

  const request: UserRequest = {
    prompt,
    conversationHistory,
    model: modelId,
    extractedEntities: intentResult.extractedEntities,
  };

  // 2. Select appropriate tool
  const matchedTool: AITool | null = findToolForRequest(request);

  if (matchedTool) {
    try {
      const toolResult: ToolResult = await matchedTool.execute(request);

      if (toolResult.type === "image" && toolResult.imageUrl) {
        // Return structured JSON representation for Image Messages (Requirement 11)
        const imagePayload = JSON.stringify({
          type: "image",
          url: toolResult.imageUrl,
          alt: toolResult.imageAlt || prompt,
          prompt: toolResult.imagePrompt || prompt,
          caption: toolResult.content || `Generated image for: ${prompt}`,
        });

        return {
          intent: intentResult.intent,
          toolUsed: matchedTool.getName(),
          isImageMessage: true,
          rawResult: toolResult,
          outputPayload: imagePayload,
        };
      }

      // Return text or error result
      return {
        intent: intentResult.intent,
        toolUsed: matchedTool.getName(),
        isImageMessage: false,
        rawResult: toolResult,
        outputPayload: toolResult.content,
      };
    } catch (toolError) {
      console.error(`Tool execution error for ${matchedTool.getName()}:`, toolError);
    }
  }

  // 3. Fallback to High-Quality Contextual LLM Responder (No Generic Fallbacks!)
  const fallbackText = generateContextualResponse(prompt, modelId);

  return {
    intent: intentResult.intent,
    isImageMessage: false,
    rawResult: null,
    outputPayload: fallbackText,
  };
}
