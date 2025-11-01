"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";
import { useMarkNotificationAsRead } from "@/hooks/use-mark-notification-read";
import { useMarkAllNotificationsAsRead } from "@/hooks/use-mark-all-notifications-read";
import { useDeleteNotification } from "@/hooks/use-delete-notification";
import { usePusherNotificationUpdates } from "@/hooks/use-pusher-notification-updates";
import { useSession } from "@/lib/auth-client";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function NotificationsDropdown() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: notificationsData, isLoading } = useNotifications();
  const { data: unreadCountData } = useUnreadNotificationCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  // Enable real-time notifications
  usePusherNotificationUpdates(session?.user?.id);

  const notifications = notificationsData?.notifications || [];
  const unreadCount = unreadCountData?.count || 0;

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }

    // Navigate to link if exists
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification.mutate(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "APPLICATION_RECEIVED":
        return "📨";
      case "APPLICATION_STATUS_CHANGED":
        return "📝";
      case "NEW_MESSAGE":
        return "💬";
      case "SHORTLISTED":
        return "⭐";
      case "ACCEPTED":
        return "🎉";
      case "REJECTED":
        return "📋";
      case "JOB_EXPIRED":
        return "⏰";
      case "JOB_FILLED":
        return "✅";
      case "NEW_RECOMMENDATION":
        return "💡";
      default:
        return "📬";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-accent transition-colors group relative",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            "text-sm font-medium line-clamp-1",
                            !notification.isRead && "font-semibold"
                          )}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => handleDelete(e, notification.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
