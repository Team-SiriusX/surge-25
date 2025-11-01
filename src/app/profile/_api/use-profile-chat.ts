"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

export function useProfileChat() {
  const [streamedContent, setStreamedContent] = useState("");

  return useMutation({
    mutationKey: [QUERY_KEYS.PROFILE_CHAT],
    mutationFn: async (data: ChatRequest): Promise<string> => {
      const response = await fetch("/api/profile/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch chat response" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      setStreamedContent("");

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamedContent(fullContent);
        }
      } catch (error) {
        console.error("Streaming error:", error);
        throw new Error("Stream interrupted");
      }

      return fullContent;
    },
  });
}
