import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// The API key is stored in .env as OPEN_AI_KEY (not the default OPENAI_API_KEY
// that @ai-sdk/openai auto-reads), so read it explicitly.
const openai = createOpenAI({ apiKey: process.env.OPEN_AI_KEY });

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
