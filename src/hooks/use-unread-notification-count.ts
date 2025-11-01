"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

export function useUnreadNotificationCount() {
  return useQuery<{ count: number }>({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const res = await fetch("/api/notifications/unread-count");

      if (!res.ok) {
        throw new Error("Failed to fetch unread count");
      }

      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
