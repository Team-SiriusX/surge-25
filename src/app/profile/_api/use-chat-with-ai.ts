import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useChatWithAI = () => {
  return useMutation({
    mutationFn: async ({ messages }: { messages: Message[] }) => {
      const response = await client.api.profile.chat.$post({
        json: { messages },
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
      }

      return fullText;
    },
  });
};
