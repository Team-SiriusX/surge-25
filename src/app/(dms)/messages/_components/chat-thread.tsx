"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip } from "lucide-react";

interface ChatThreadProps {
  conversation: any;
  messages: any[];
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  users: any[];
}

export default function ChatThread({
  conversation,
  messages,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  users,
}: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getUser = (userId: string) => users.find((u) => u.id === userId);
  const otherUser = users.find((user) => user.id !== "current-user");
  const currentUser = users.find((u) => u.id === "current-user");

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={otherUser?.image || "/placeholder.svg"}
              alt={otherUser?.name}
            />
            <AvatarFallback>
              {otherUser?.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{otherUser?.name}</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        {conversation.jobPost && (
          <Badge variant="outline">{conversation.jobPost.type}</Badge>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]: any) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            <div className="space-y-3">
              {(dateMessages as any[]).map((message: any) => {
                const sender = getUser(message.senderId);
                const isCurrentUser = message.senderId === "current-user";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isCurrentUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage
                        src={sender?.image || "/placeholder.svg"}
                        alt={sender?.name}
                      />
                      <AvatarFallback>
                        {sender?.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-xs ${isCurrentUser ? "items-end" : ""}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            className="flex-1"
            value={messageInput}
            onChange={(e) => onMessageInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button size="icon" onClick={onSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function groupMessagesByDate(messages: any[]) {
  return messages.reduce((acc, message) => {
    const date = formatDate(message.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, any[]>);
}

function formatDate(date: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
