"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { toast } from "sonner";

type MessagePosterButtonProps = {
  posterId: string;
  jobPostId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function MessagePosterButton({
  posterId,
  jobPostId,
  variant = "outline",
  size = "default",
  className,
}: MessagePosterButtonProps) {
  const router = useRouter();
  const createConversation = useCreateConversation();

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering

    try {
      const result = await createConversation.mutateAsync({
        receiverId: posterId,
        jobPostId,
      });

      // Navigate to messages page with the conversation selected
      router.push(`/messages?conversationId=${result.conversation.id}`);
    } catch (error) {
      toast.error("Failed to start conversation");
      console.error(error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleMessage}
      disabled={createConversation.isPending}
      className={className}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Message Poster
    </Button>
  );
}
