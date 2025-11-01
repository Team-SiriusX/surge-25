"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

type CreateConversationInput = {
  otherUserId: string;
  jobPostId?: string;
};

type ConversationResponse = {
  conversation: {
    id: string;
    jobPostId: string | null;
    createdAt: string;
    updatedAt: string;
    participants: {
      userId: string;
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
      };
    }[];
  };
};

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<ConversationResponse, Error, CreateConversationInput>({
    mutationFn: async (data) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create conversation");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.list(),
      });
    },
  });
}
