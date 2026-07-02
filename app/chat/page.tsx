"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageSquareIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) {
      return;
    }
    sendMessage({ text: message.text });
    setInput("");
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col bg-background px-4 pb-6 text-foreground">
      <Conversation className="flex-1">
        <ConversationContent className="gap-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquareIcon className="size-12" />}
              title="What can I help with?"
              description="Ask me anything to begin chatting."
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={`${message.id}-${i}`}>
                        {part.text}
                      </MessageResponse>
                    ) : null
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={handleSubmit}
        className="relative mt-4 [&_[data-slot=input-group]]:rounded-3xl [&_[data-slot=input-group]]:border-border/60 [&_[data-slot=input-group]]:bg-secondary [&_[data-slot=input-group]]:shadow-lg"
      >
        <PromptInputTextarea
          value={input}
          placeholder="Message the assistant..."
          onChange={(e) => setInput(e.currentTarget.value)}
          className="bg-transparent px-4 py-3.5 pr-14 text-foreground placeholder:text-muted-foreground"
        />
        <PromptInputSubmit
          status={status}
          disabled={!input.trim() && status !== "streaming"}
          className="absolute right-2.5 bottom-2.5 size-9 rounded-full"
        />
      </PromptInput>
    </div>
  );
}
