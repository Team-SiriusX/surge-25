"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import type Pusher from "pusher-js";

export function usePusherNotifications(userId: string | null) {
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
    if (!pusherClient || !userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("new-message", () => {
      // Invalidate conversations list to show new conversation/message
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.list(),
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [pusherClient, userId, queryClient]);
}
