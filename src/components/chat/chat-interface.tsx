"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  MessageSquare,
  Send,
  Briefcase,
  MoreVertical,
  Paperclip,
  X,
  FileIcon,
  ImageIcon,
  FileTextIcon,
  VideoIcon,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConversation } from "@/hooks/use-conversation";
import { useSendMessage } from "@/hooks/use-send-message";
import { usePusherConversation } from "@/hooks/use-pusher-conversation";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ChatInterfaceProps = {
  conversationId: string;
  currentUserId: string;
  onBack?: () => void;
};

type AttachmentData = {
  url: string;
  name: string;
  type: string;
  size: number;
};

export function ChatInterface({
  conversationId,
  currentUserId,
  onBack,
}: ChatInterfaceProps) {
  const { data, isLoading } = useConversation(conversationId);
  const sendMessage = useSendMessage();
  const [messageContent, setMessageContent] = useState("");
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

    if (!messageContent.trim() && !attachment) return;

    try {
      await sendMessage.mutateAsync({
        conversationId,
        content:
          messageContent.trim() || (attachment ? "Sent an attachment" : ""),
        attachmentUrl: attachment?.url,
        attachmentName: attachment?.name,
        attachmentType: attachment?.type,
        attachmentSize: attachment?.size,
      });
      setMessageContent("");
      setAttachment(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getFileIcon = (type?: string | null) => {
    if (!type) return FileIcon;
    if (type.startsWith("image/")) return ImageIcon;
    if (type.startsWith("video/")) return VideoIcon;
    if (type.includes("pdf")) return FileTextIcon;
    return FileIcon;
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
    <div className="flex h-full w-full flex-col">
      {/* Chat header - Enhanced */}
      <div className="border-b bg-card/50 p-3 sm:p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back button for mobile */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0 md:hidden h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-border shrink-0">
            <AvatarImage src={otherParticipant?.image || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base">
              {otherParticipant?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base sm:text-lg truncate">
                {otherParticipant?.name}
              </h3>
              <div
                className="h-2 w-2 rounded-full bg-green-500 shrink-0"
                title="Online"
              />
            </div>
            {conversation.jobPost && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <Briefcase className="h-3 w-3 shrink-0" />
                <p className="truncate">
                  {conversation.jobPost.title} at{" "}
                  {conversation.jobPost.companyName}
                </p>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              {conversation.jobPost && (
                <DropdownMenuItem>View Job Post</DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 bg-muted/20 p-2 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[300px] sm:min-h-[400px] items-center justify-center px-4">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
                <p className="text-base sm:text-lg font-medium text-muted-foreground">
                  No messages yet
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/70">
                  Start the conversation by sending a message below
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              // Safety check for message data
              if (!message || !message.senderId || !message.sender) {
                console.error("Invalid message data:", message);
                return null;
              }

              const isCurrentUser = message.senderId === currentUserId;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showAvatar =
                !prevMessage || prevMessage.senderId !== message.senderId;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 sm:gap-3 transition-all",
                    isCurrentUser && "flex-row-reverse"
                  )}
                >
                  {showAvatar ? (
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-background shrink-0">
                      <AvatarImage src={message.sender.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {message.sender.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-7 w-7 sm:h-8 sm:w-8" />
                  )}
                  <div
                    className={cn(
                      "flex max-w-[75%] sm:max-w-[70%] flex-col gap-1",
                      isCurrentUser && "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "group relative rounded-2xl px-3 py-2 sm:px-4 shadow-sm transition-all hover:shadow-md",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      )}
                    >
                      {/* Attachment display */}
                      {message.attachmentUrl && (
                        <div className="mb-2">
                          {message.attachmentType?.startsWith("image/") ? (
                            <a
                              href={message.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={message.attachmentUrl}
                                alt={message.attachmentName || "Image"}
                                className="max-w-[250px] sm:max-w-xs rounded-lg"
                              />
                            </a>
                          ) : (
                            <a
                              href={message.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "flex items-center gap-2 rounded-lg border p-2 sm:p-3 transition-colors",
                                isCurrentUser
                                  ? "border-primary-foreground/20 hover:border-primary-foreground/40"
                                  : "border-border hover:border-foreground/40"
                              )}
                            >
                              {(() => {
                                const Icon = getFileIcon(
                                  message.attachmentType
                                );
                                return <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />;
                              })()}
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-xs sm:text-sm font-medium">
                                  {message.attachmentName}
                                </p>
                                <p
                                  className={cn(
                                    "text-[10px] sm:text-xs",
                                    isCurrentUser
                                      ? "opacity-80"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {formatFileSize(message.attachmentSize)}
                                </p>
                              </div>
                              <Download className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                            </a>
                          )}
                        </div>
                      )}
                      {message.content && (
                        <p className="whitespace-pre-wrap break-words text-xs sm:text-sm">
                          {message.content}
                        </p>
                      )}
                    </div>
                    {showAvatar && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), "MMM d, h:mm a")}
                        </span>
                        {isCurrentUser && message.isRead && (
                          <Badge
                            variant="outline"
                            className="text-[10px] sm:text-xs py-0 px-1 h-3 sm:h-4"
                          >
                            Read
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Message input - Enhanced with file upload */}
      <form onSubmit={handleSendMessage} className="border-t bg-card p-2 sm:p-3 md:p-4">
        {/* Attachment preview or uploading state */}
        {(attachment || isUploading) && (
          <div className="mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 rounded-lg border bg-muted/50 p-2 sm:p-3">
            {isUploading ? (
              <>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded bg-muted">
                  <Spinner className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Uploading file...</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Please wait</p>
                </div>
              </>
            ) : attachment ? (
              <>
                {attachment.type.startsWith("image/") ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded bg-muted">
                    {(() => {
                      const Icon = getFileIcon(attachment.type);
                      return <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />;
                    })()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs sm:text-sm font-medium">
                    {attachment.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setAttachment(null)}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>
            ) : null}
          </div>
        )}

        <div className="flex items-end gap-1 sm:gap-1.5">
          <Textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] resize-none flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
            disabled={sendMessage.isPending || isUploading}
          />

          <div className="flex gap-1 sm:gap-1.5">
            {/* Upload button - styled as icon button */}
            <UploadButton
              endpoint="messageAttachment"
              onBeforeUploadBegin={(files) => {
                setIsUploading(true);
                return files;
              }}
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                if (res && res[0]) {
                  setAttachment({
                    url: res[0].url,
                    name: res[0].name,
                    type: res[0].type || "application/octet-stream",
                    size: res[0].size,
                  });
                  toast.success("File uploaded!");
                }
              }}
              onUploadError={(error: Error) => {
                setIsUploading(false);
                toast.error(`Upload failed: ${error.message}`);
              }}
              appearance={{
                button: cn(
                  "ut-ready:!bg-secondary ut-uploading:cursor-not-allowed",
                  "ut-ready:!border-2 ut-ready:!border-border ut-ready:rounded-md",
                  "ut-ready:hover:bg-accent ut-ready:hover:border-primary",
                  "ut-ready:transition-all ut-ready:duration-200",
                  "ut-uploading:bg-muted ut-uploading:opacity-50",
                  "h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] shrink-0 cursor-pointer p-0 flex items-center justify-center"
                ),
                container: "w-fit h-fit",
                allowedContent: "hidden",
              }}
              content={{
                button({ ready, isUploading: uploading }) {
                  if (uploading || isUploading) {
                    return (
                      <div className="flex items-center justify-center w-full h-full">
                        <Spinner className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                    );
                  }
                  if (ready) {
                    return (
                      <div className="flex items-center justify-center w-full h-full">
                        <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      </div>
                    );
                  }
                  return (
                    <div className="flex items-center justify-center w-full h-full">
                      <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-50 text-primary" />
                    </div>
                  );
                },
              }}
            />

            <Button
              type="submit"
              size="icon"
              disabled={
                (!messageContent.trim() && !attachment) ||
                sendMessage.isPending ||
                isUploading
              }
              className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] shrink-0"
            >
              {sendMessage.isPending ? (
                <Spinner className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
          Press <kbd className="rounded border px-1">Enter</kbd> to send,{" "}
          <kbd className="rounded border px-1">Shift</kbd> +{" "}
          <kbd className="rounded border px-1">Enter</kbd> for new line
        </p>
      </form>
    </div>
  );
}
