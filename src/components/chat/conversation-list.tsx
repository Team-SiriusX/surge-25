"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Search, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

type ConversationListProps = {
  currentUserId: string;
  selectedConversationId?: string | null;
  onSelectConversation: (conversationId: string) => void;
};

type FilterType = "all" | "unread";

export function ConversationList({
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const { data, isLoading } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    if (!data?.conversations) return [];

    let filtered = data.conversations;

    // Apply unread filter
    if (filter === "unread") {
      filtered = filtered.filter((conv) => conv.unreadCount > 0);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((conv) => {
        const otherParticipant = conv.participants.find(
          (p) => p.userId !== currentUserId
        )?.user;

        const nameMatch = otherParticipant?.name?.toLowerCase().includes(query);
        const jobMatch = conv.jobPost?.title?.toLowerCase().includes(query);
        const companyMatch = conv.jobPost?.companyName
          ?.toLowerCase()
          .includes(query);
        const messageMatch = conv.lastMessage?.content
          ?.toLowerCase()
          .includes(query);

        return nameMatch || jobMatch || companyMatch || messageMatch;
      });
    }

    return filtered;
  }, [data?.conversations, filter, searchQuery, currentUserId]);

  // Count unread conversations for badge
  const unreadCount = useMemo(() => {
    return (
      data?.conversations.filter((conv) => conv.unreadCount > 0).length || 0
    );
  }, [data?.conversations]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <Skeleton className="mb-4 h-8 w-32" />
          <Skeleton className="mb-4 h-10 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
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
      </div>
    );
  }

  const hasNoConversations = !data || data.conversations.length === 0;
  const hasNoResults =
    !hasNoConversations && filteredConversations.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header with Search and Filters */}
      <div className="border-b p-4">
        <h1 className="mb-4 text-lg font-semibold">Messages</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            All
            {data && data.conversations.length > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-full px-2">
                {data.conversations.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="flex-1"
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-full px-2">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      {hasNoConversations ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold">No conversations yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation to see it here
          </p>
        </div>
      ) : hasNoResults ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold">No results found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? `No conversations match "${searchQuery}"`
              : "No unread conversations"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
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
      )}
    </div>
  );
}
