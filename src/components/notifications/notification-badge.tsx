"use client";

import { Badge } from "@/components/ui/badge";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";
import { usePusherNotificationUpdates } from "@/hooks/use-pusher-notification-updates";
import { useSession } from "@/lib/auth-client";

export function NotificationBadge() {
  const { data: session } = useSession();
  const { data: unreadCountData } = useUnreadNotificationCount();
  
  // Enable real-time notifications
  usePusherNotificationUpdates(session?.user?.id);

  const unreadCount = unreadCountData?.count || 0;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="h-5 min-w-[20px] flex items-center justify-center p-0 px-1 text-xs"
    >
      {unreadCount > 9 ? "9+" : unreadCount}
    </Badge>
  );
}
