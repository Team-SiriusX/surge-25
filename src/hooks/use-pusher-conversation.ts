"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import type Pusher from "pusher-js";

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

export function usePusherConversation(conversationId: string | null) {
  const queryClient = useQueryClient();
  const [pusherClient, setPusherClient] = useState<Pusher | null>(null);

  useEffect(() => {
    // Dynamically import Pusher client
    const initPusher = async () => {
      const { getPusherClient } = await import("@/lib/pusher");
      const client = getPusherClient();
      setPusherClient(client);
    };

    initPusher();
  }, []);

  useEffect(() => {
    if (!pusherClient || !conversationId) return;

    const channel = pusherClient.subscribe(`conversation-${conversationId}`);

    channel.bind("new-message", (message: Message) => {
      // Update conversation detail query with new message
      queryClient.setQueryData(
        queryKeys.conversations.detail(conversationId),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            conversation: {
              ...old.conversation,
              messages: [...(old.conversation.messages || []), message],
              updatedAt: new Date().toISOString(),
            },
          };
        }
      );

      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.list(),
      });
    });

    channel.bind("message-read", () => {
      // Refetch conversation to get updated read status
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(conversationId),
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [pusherClient, conversationId, queryClient]);
}
