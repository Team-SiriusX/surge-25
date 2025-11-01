"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  metadata: any;
  createdAt: string;
  readAt: string | null;
  userId: string;
};

export function useNotifications() {
  return useQuery<{ notifications: Notification[] }>({
    queryKey: queryKeys.notifications.list(),
    queryFn: async () => {
      const res = await fetch("/api/notifications");

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      return res.json();
    },
  });
}
