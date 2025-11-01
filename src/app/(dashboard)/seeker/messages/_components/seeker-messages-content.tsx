"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ConversationList } from "@/components/chat/conversation-list";
import { usePusherNotifications } from "@/hooks/use-pusher-notifications";

type SeekerMessagesContentProps = {
  userId: string;
};

export function SeekerMessagesContent({ userId }: SeekerMessagesContentProps) {
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
    <div className="flex h-full flex-col px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Conversations with talent finders about your applications
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-lg border">
        <div className="w-1/3 border-r">
          <ConversationList
            currentUserId={userId}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        <div className="flex flex-1 flex-col">
          {selectedConversationId ? (
            <ChatInterface
              conversationId={selectedConversationId}
              currentUserId={userId}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
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
