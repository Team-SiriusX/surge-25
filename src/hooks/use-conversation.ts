"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

type Message = {
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
    jobPost: {
      id: string;
      title: string;
      companyName: string;
      description: string;
    } | null;
    messages: Message[];
  };
};

export function useConversation(conversationId: string | null) {
  return useQuery<ConversationResponse>({
    queryKey: queryKeys.conversations.detail(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) throw new Error("Conversation ID is required");
      
      const res = await fetch(`/api/messages/${conversationId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch conversation");
      }
      const data = await res.json();
      
      // Log the data to debug
      console.log("Conversation data:", data);
      
      return data;
    },
    enabled: !!conversationId,
  });
}
