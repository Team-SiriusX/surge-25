"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useConversation } from "@/hooks/use-conversation";
import { useSendMessage } from "@/hooks/use-send-message";
import { usePusherConversation } from "@/hooks/use-pusher-conversation";
import { cn } from "@/lib/utils";

type ChatInterfaceProps = {
  conversationId: string;
  currentUserId: string;
};

export function ChatInterface({
  conversationId,
  currentUserId,
}: ChatInterfaceProps) {
  const { data, isLoading } = useConversation(conversationId);
  const sendMessage = useSendMessage();
  const [messageContent, setMessageContent] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time updates
  usePusherConversation(conversationId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [data?.conversation.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim()) return;

    try {
      await sendMessage.mutateAsync({
        conversationId,
        content: messageContent.trim(),
      });
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!data || !data.conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  const { conversation } = data;
  
  // Ensure messages array exists
  const messages = conversation.messages || [];
  
  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== currentUserId
  )?.user;

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherParticipant?.image || undefined} />
            <AvatarFallback>
              {otherParticipant?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{otherParticipant?.name}</h3>
            {conversation.jobPost && (
              <p className="text-sm text-muted-foreground">
                Re: {conversation.jobPost.title} at {conversation.jobPost.companyName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium text-muted-foreground">
                  No messages yet
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Start the conversation by sending a message below
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              // Safety check for message data
              if (!message || !message.senderId || !message.sender) {
                console.error("Invalid message data:", message);
                return null;
              }

              const isCurrentUser = message.senderId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isCurrentUser && "flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.image || undefined} />
                    <AvatarFallback>
                      {message.sender.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex max-w-[70%] flex-col gap-1",
                      isCurrentUser && "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] resize-none"
            disabled={sendMessage.isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!messageContent.trim() || sendMessage.isPending}
            className="h-[60px] w-[60px]"
          >
            {sendMessage.isPending ? (
              <Spinner className="h-5 w-5" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  );
}
