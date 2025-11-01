"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

export function useMarkMessagesRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (conversationId) => {
      const res = await fetch(`/api/messages/${conversationId}/read`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to mark messages as read");
      }
    },
    onSuccess: (_, conversationId) => {
      // Invalidate conversations list to update unread counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.list(),
      });

      // Invalidate specific conversation
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(conversationId),
      });
    },
  });
}
