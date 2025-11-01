"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getPusherClient } from "@/lib/pusher";

export function usePusherNotificationUpdates(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const pusherClient = getPusherClient();
    const channel = pusherClient.subscribe(`user-${userId}`);

    // Listen for new notifications
    channel.bind("new-notification", (notification: any) => {
      console.log("New notification received:", notification);

      // Invalidate queries to refetch notifications
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(),
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId, queryClient]);
}
