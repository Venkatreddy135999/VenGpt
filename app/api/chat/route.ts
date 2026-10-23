import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import { DEFAULT_SYSTEM_PROMPT, cleanTitleFromMessage } from "@/lib/ai";
import { generateContextualResponse } from "@/lib/conversationalResponder";
import { saveMemoryConversation, addMemoryMessage } from "@/lib/memoryStore";
import { findRelevantKnowledge, formatKnowledgeContext } from "@/lib/dataset";
import { buildRAGContext } from "@/lib/rag/ragEngine";
import { routeUserRequest } from "@/lib/requestRouter";

export const maxDuration = 60;

function createSimulatedStream(content: string) {
  const encoder = new TextEncoder();
  const chunks = content.split(/(\s+)/);
  let i = 0;
  let timer: NodeJS.Timeout | null = null;

  return new ReadableStream({
    start(controller) {
      function push() {
        if (i < chunks.length) {
          try {
            controller.enqueue(encoder.encode(chunks[i]));
            i++;
            timer = setTimeout(push, 15);
          } catch {
            // Client closed stream early
          }
        } else {
          try {
            controller.close();
          } catch {}
        }
      }
      push();
    },
    cancel() {
      if (timer) clearTimeout(timer);
      i = chunks.length;
    },
  });
}

function cleanAiOutput(rawText: string): string {
  // Strip third-party ads or footers if present
  let cleaned = rawText
    .replace(/---\s*\n+\*?\*?Support Pollinations\.AI[\s\S]*$/gi, "")
    .replace(/d\?\?,\s*\*?\*?Ad\*?\*?[\s\S]*$/gi, "")
    .replace(/Powered by Pollinations[\s\S]*$/gi, "")
    .trim();
  return cleaned;
}

async function fetchRealAiResponse(messages: any[], systemPrompt: string): Promise<string> {
  const recentMessages = messages.slice(-6);
  const res = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(4500),
    body: JSON.stringify({
      messages: [
        { role: "system", content: `${systemPrompt} Strict instruction: Provide 100% accurate, factual data. Never invent cricket records, statistics, or code. Do not include ads or promotional text.` },
        ...recentMessages,
      ],
      model: "openai",
      reasoning: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI gateway error: ${res.statusText}`);
  }

  const text = await res.text();
  if (!text || text.includes("Payment Required") || text.includes("quota exceeded")) {
    throw new Error("AI gateway returned payment/quota restriction");
  }
  return cleanAiOutput(text);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const userId = (await getAuthUserId()) || "dev_user_local";

    // 2. Parse and validate request
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { conversationId, messages, model, temperature, webSearch } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "At least one message is required." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== "string" || !lastMessage.content.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const userPrompt = lastMessage.content.trim();

    // 3. Resolve or create conversation
    let resolvedConversationId = conversationId;
    let conversationTitle = "New Conversation";

    try {
      if (conversationId) {
        const existing = await db.conversation.findUnique({
          where: { id: conversationId },
        });

        if (existing && existing.clerkUserId === userId) {
          resolvedConversationId = existing.id;
          conversationTitle = existing.title;
        }
      }

      if (!resolvedConversationId) {
        conversationTitle = cleanTitleFromMessage(userPrompt);
        const created = await db.conversation.create({
          data: {
            clerkUserId: userId,
            title: conversationTitle,
          },
        });
        resolvedConversationId = created.id;
      }

      // Save user message to database
      await db.message.create({
        data: {
          conversationId: resolvedConversationId,
          role: "user",
          content: userPrompt,
        },
      });
    } catch (dbErr) {
      // Fallback in-memory ID if PostgreSQL is not currently connected
      if (!resolvedConversationId) {
        resolvedConversationId = `conv-${Date.now()}`;
        conversationTitle = cleanTitleFromMessage(userPrompt);
      }
    }

    // Always keep memoryStore synced
    saveMemoryConversation(resolvedConversationId, userId, conversationTitle);
    addMemoryMessage(resolvedConversationId, "user", userPrompt);

    // 4. Format messages for LLM
    const formattedMessages = messages
      .filter((m: { role?: string; content?: string }) => m.role && m.content)
      .map((m: { role: string; content: string }) => ({
        role: (m.role === "assistant" || m.role === "user" ? m.role : "user") as "user" | "assistant",
        content: m.content,
      }));

    const modelName = model || process.env.OPENAI_MODEL || "gpt-4o-mini";
    const apiKey = process.env.OPENAI_API_KEY;
    const hasLiveKey =
      Boolean(apiKey) &&
      typeof apiKey === "string" &&
      apiKey.startsWith("sk-") &&
      !apiKey.includes("your_openai_api_key");

    // Retrieve relevant knowledge from dataset (RAG Grounding)
    const ragContext = buildRAGContext(userPrompt);
    const relevantKnowledge = findRelevantKnowledge(userPrompt);
    const knowledgeContext = formatKnowledgeContext(relevantKnowledge);
    const effectiveSystemPrompt = `${DEFAULT_SYSTEM_PROMPT}${knowledgeContext}${ragContext}`;

    // 5. If official OPENAI_API_KEY is configured in .env, stream directly from OpenAI via Vercel AI SDK
    if (hasLiveKey) {
      const parsedTemp = typeof temperature === "number" ? Math.min(Math.max(temperature, 0), 2) : 0.7;

      const result = streamText({
        model: openai(modelName),
        system: effectiveSystemPrompt,
        messages: formattedMessages,
        temperature: parsedTemp,
        async onFinish({ text }) {
          if (text && text.trim().length > 0) {
            try {
              await db.message.create({
                data: {
                  conversationId: resolvedConversationId,
                  role: "assistant",
                  content: text,
                },
              });

              await db.conversation.update({
                where: { id: resolvedConversationId },
                data: { updatedAt: new Date() },
              });
            } catch (saveErr) {
              console.error("Failed to save assistant message:", saveErr);
            }
          }
        },
      });

      const response = result.toTextStreamResponse();
      response.headers.set("X-Conversation-Id", resolvedConversationId);
      response.headers.set("X-Conversation-Title", encodeURIComponent(conversationTitle));
      return response;
    }

    // 6. Central Request Router: Intent Detection -> Tool/Capability Execution -> Output Formatter
    const priorHistory = formattedMessages.slice(0, -1);
    const routed = await routeUserRequest(userPrompt, priorHistory, modelName, {
      webSearch: Boolean(webSearch),
    });
    let answerText = routed.outputPayload;

    // If request was general chat and no specific tool was triggered, attempt live LLM gateway
    if (routed.intent === "general_conversation" && !routed.toolUsed) {
      try {
        const liveAi = await fetchRealAiResponse(formattedMessages, effectiveSystemPrompt);
        if (liveAi && liveAi.length > 5) {
          answerText = liveAi;
        }
      } catch {
        // Keeps routed.outputPayload
      }
    }

    const stream = createSimulatedStream(answerText);

    // Persist assistant message to database if available
    try {
      await db.message.create({
        data: {
          conversationId: resolvedConversationId,
          role: "assistant",
          content: answerText,
        },
      });
      await db.conversation.update({
        where: { id: resolvedConversationId },
        data: { updatedAt: new Date() },
      });
    } catch {}

    addMemoryMessage(resolvedConversationId, "assistant", answerText);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Conversation-Id": resolvedConversationId,
        "X-Conversation-Title": encodeURIComponent(conversationTitle),
      },
    });
  } catch (error: any) {
    console.error("Chat API route error:", error);

    let message = "An unexpected error occurred while communicating with the AI service.";
    let status = 500;

    if (error?.status === 401 || error?.message?.includes("API key")) {
      message = "Invalid or expired OpenAI API key. Please check your credentials.";
      status = 401;
    } else if (error?.status === 429 || error?.message?.includes("rate limit")) {
      message = "Rate limit reached. Please wait a few moments before trying again.";
      status = 429;
    } else if (error?.message?.includes("quota")) {
      message = "OpenAI quota limit reached. Please review your billing account.";
      status = 402;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
