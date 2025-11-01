"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ConversationList } from "@/components/chat/conversation-list";
import { usePusherNotifications } from "@/hooks/use-pusher-notifications";

type FinderMessagesContentProps = {
  userId: string;
};

export function FinderMessagesContent({ userId }: FinderMessagesContentProps) {
  const searchParams = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  // Subscribe to real-time notifications
  usePusherNotifications(userId);

  // Handle conversation query parameter
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId) {
      setSelectedConversationId(conversationId);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Chat with talent seekers who applied to your jobs
        </p>
      </div>

      <div className="grid h-[calc(100vh-12rem)] grid-cols-12 gap-6 overflow-hidden rounded-lg border">
        <div className="col-span-4 border-r">
          <ConversationList
            currentUserId={userId}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className="col-span-8 h-full">
          {selectedConversationId ? (
            <ChatInterface
              conversationId={selectedConversationId}
              currentUserId={userId}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-2xl font-semibold">
                Select a conversation
              </h2>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
