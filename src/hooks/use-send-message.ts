"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

type SendMessageInput = {
  conversationId: string;
  content: string;
};

type MessageResponse = {
  message: {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    receiver: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  };
};

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, Error, SendMessageInput>({
    mutationFn: async ({ conversationId, content }) => {
      const res = await fetch(`/api/messages/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send message");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.list(),
      });

      // Invalidate specific conversation to show new message
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(variables.conversationId),
      });
    },
  });
}
