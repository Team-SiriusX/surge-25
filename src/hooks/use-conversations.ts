"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

type Conversation = {
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
  jobPost: {
    id: string;
    title: string;
    companyName: string;
  } | null;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
};

type ConversationsResponse = {
  conversations: Conversation[];
};

export function useConversations() {
  return useQuery<ConversationsResponse>({
    queryKey: queryKeys.conversations.list(),
    queryFn: async () => {
      const res = await fetch("/api/messages/conversations");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch conversations");
      }
      return res.json();
    },
  });
}
