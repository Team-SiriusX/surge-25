"use client";

import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useGenerateProfileInsights() {
  return useMutation({
    mutationKey: [QUERY_KEYS.PROFILE_CHAT],
    mutationFn: async (): Promise<string> => {
      const systemPrompt = `You are an expert career advisor. Analyze the student's profile and provide a structured analysis in the following format:

**Score: [X/100]**

**Strengths:**
- [What's working well in their profile]
- [Strong points that stand out]
- [Positive aspects to maintain]

**Improvements:**
- [Specific areas that need work]
- [Missing or weak elements]
- [Recommendations for enhancement]

**Quick Wins:**
- [Immediate actions they can take]
- [Easy improvements with high impact]
- [Simple next steps]

Keep it concise, actionable, and encouraging. Focus on what they can improve on their profile page.`;

      const response = await fetch("/api/profile/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "Please analyze my profile and give me detailed recommendations for improvement.",
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate insights" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
        }
      } catch (error) {
        console.error("Streaming error:", error);
        throw new Error("Stream interrupted");
      }

      return fullContent;
    },
  });
}
