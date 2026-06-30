import { toServerSentEventsResponse } from "@tanstack/ai";
import type { StreamChunk } from "@tanstack/ai";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function* groqChatStream(
  messages: Array<{ role: string; content: string }>,
): AsyncIterable<StreamChunk> {
  const timestamp = Date.now();
  const id = `groq-${timestamp}`;
  const model = "llama-3.3-70b-versatile";
  let accumulatedContent = "";

  const stream = await groq.chat.completions.create({
    model,
    messages: messages as Array<Groq.ChatCompletionMessageParam>,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    if (delta) {
      accumulatedContent += delta;
      yield {
        type: "content",
        id,
        model,
        timestamp,
        delta,
        content: accumulatedContent,
        role: "assistant",
      } as StreamChunk;
    }
  }

  yield {
    type: "done",
    id,
    model,
    timestamp,
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    finishReason: "stop",
  } as StreamChunk;
}

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "GROQ_API_KEY not configured",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { messages } = await request.json();

  try {
    const stream = groqChatStream(messages);
    return toServerSentEventsResponse(stream);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
