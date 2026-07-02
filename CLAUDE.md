# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Commands

```bash
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Production build
npm run start   # Serve the production build
npm run lint    # ESLint (eslint-config-next)
```

There is no test runner configured in this project.

## Guidelines
Always only import or install required or necessary components. Do not proactively or preemptively import useless components.

Follow best desing principles, like the greatest designs from apple, meta, google. Use the best contrast colors when layering multiple elements in the browser. 

## Stack

- **Next.js 16** (App Router, React Server Components) + **React 19**
- **Vercel AI SDK v6** (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`) for LLM streaming
- **Tailwind CSS v4** — configured entirely in `app/globals.css` via `@import "tailwindcss"`
  and `@theme`; there is no `tailwind.config.*` file
- **shadcn/ui** (`radix-nova` style, neutral base) — config in `components.json`
- TypeScript path alias `@/*` maps to the repo root

## Architecture

The app is a streaming AI chat, wired end to end through the AI SDK:

- `app/api/chat/route.ts` — the chat backend. A `POST` handler receives
  `UIMessage[]`, runs `streamText` against an OpenAI model, and returns
  `result.toUIMessageStreamResponse()`. `maxDuration` caps streaming at 30s.
  **The OpenAI key is read from `OPEN_AI_KEY` (in `.env`), not the SDK's default
  `OPENAI_API_KEY`**, so the client is built explicitly with
  `createOpenAI({ apiKey: process.env.OPEN_AI_KEY })`. Preserve this when changing models/providers.
- `app/chat/page.tsx` — the chat UI (client component). Uses `useChat` from
  `@ai-sdk/react` with a `DefaultChatTransport` pointed at `/api/chat`. Messages
  are rendered by iterating `message.parts` and rendering `part.type === "text"`
  parts — the AI SDK v6 parts model, not a flat `message.content` string.

### Component layers

- `components/ui/` — generated shadcn/ui primitives (button, dialog, input, etc.).
- `components/ai-elements/` — higher-level chat building blocks (`Conversation`,
  `Message`, `PromptInput`) composed from the `ui/` primitives. The chat page is
  assembled from these; prefer extending them over hand-rolling chat UI.
- `lib/utils.ts` — the `cn()` class-merge helper used throughout.

Root layout (`app/layout.tsx`) loads Geist fonts as CSS variables and sets up the
`dark` variant used by the Tailwind theme.
