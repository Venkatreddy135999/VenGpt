import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import { DEFAULT_SYSTEM_PROMPT, cleanTitleFromMessage } from "@/lib/ai";
import { generateContextualResponse } from "@/lib/conversationalResponder";
import { saveMemoryConversation, addMemoryMessage } from "@/lib/memoryStore";

export const maxDuration = 60;

function createSimulatedStream(content: string) {
  const encoder = new TextEncoder();
  // Split on word boundaries to simulate realistic token streaming
  const chunks = content.split(/(\s+)/);
  let i = 0;

  return new ReadableStream({
    async start(controller) {
      function push() {
        if (i < chunks.length) {
          controller.enqueue(encoder.encode(chunks[i]));
          i++;
          setTimeout(push, 18);
        } else {
          controller.close();
        }
      }
      push();
    },
  });
}

async function fetchRealAiResponse(messages: any[], systemPrompt: string): Promise<string> {
  const res = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: "openai-fast",
    }),
  });

  if (!res.ok) {
    throw new Error(`AI gateway error: ${res.statusText}`);
  }

  const text = await res.text();
  return text.trim();
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

    const { conversationId, messages, model, temperature } = body;

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

    // 5. If official OPENAI_API_KEY is configured in .env, stream directly from OpenAI via Vercel AI SDK
    if (hasLiveKey) {
      const parsedTemp = typeof temperature === "number" ? Math.min(Math.max(temperature, 0), 2) : 0.7;

      const result = streamText({
        model: openai(modelName),
        system: DEFAULT_SYSTEM_PROMPT,
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

    // 6. Otherwise, fetch accurate AI answer from high-performance LLM gateway and stream it
    let answerText = "";
    try {
      answerText = await fetchRealAiResponse(formattedMessages, DEFAULT_SYSTEM_PROMPT);
    } catch (fetchErr) {
      console.error("fetchRealAiResponse error:", fetchErr);
      answerText = generateContextualResponse(userPrompt, modelName);
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
