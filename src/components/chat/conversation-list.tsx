"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

type ConversationListProps = {
  currentUserId: string;
  selectedConversationId?: string | null;
  onSelectConversation: (conversationId: string) => void;
};

export function ConversationList({
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const { data, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold">No conversations yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a conversation to see it here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {data.conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p.userId !== currentUserId
          )?.user;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full rounded-lg p-3 text-left transition-colors hover:bg-accent",
                selectedConversationId === conversation.id && "bg-accent"
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherParticipant?.image || undefined} />
                  <AvatarFallback>
                    {otherParticipant?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="font-semibold">
                      {otherParticipant?.name}
                    </h4>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessage.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                    )}
                  </div>
                  {conversation.jobPost && (
                    <p className="mb-1 truncate text-xs text-muted-foreground">
                      {conversation.jobPost.title} at{" "}
                      {conversation.jobPost.companyName}
                    </p>
                  )}
                  {conversation.lastMessage && (
                    <p className="truncate text-sm text-muted-foreground">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="mt-2">
                      {conversation.unreadCount} new
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
