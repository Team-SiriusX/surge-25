"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { useProfileChat } from "@/app/profile/_api/use-profile-chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ProfileChatInsights() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI profile advisor. I've analyzed your profile and I'm here to help you optimize it for better job opportunities. What would you like to improve?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending } = useProfileChat();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessages = [...messages, userMessage];
    setInput("");

    sendMessage(
      { messages: currentMessages },
      {
        onSuccess: (aiMessage: string) => {
          setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
        },
        onError: (error: Error) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `❌ Sorry, I encountered an error: ${error.message}. Please try again.`,
            },
          ]);
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-neutral-950/50 border-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg font-semibold">AI Profile Insights</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-blue-950/40 text-blue-400 border-blue-800">
          <Bot className="h-3 w-3 mr-1" />
          Powered by Gemini
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-blue-950/50 border border-blue-800 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-neutral-300" />
                  </div>
                )}
              </div>
            ))}
            {isPending && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-blue-950/50 border border-blue-800 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-400 animate-pulse" />
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask for advice or specific improvements..."
            disabled={isPending}
            className="flex-1 bg-neutral-900 border-neutral-800 focus-visible:ring-blue-500"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isPending}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-neutral-500 text-center">
          AI-generated advice • Always verify suggestions before implementing
        </p>
      </CardContent>
    </Card>
  );
}
