"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ConversationList as RealConversationList } from "@/components/chat/conversation-list"
import { useSession } from "@/lib/auth-client"
import { usePusherNotifications } from "@/hooks/use-pusher-notifications"
import { MessageSquare } from "lucide-react"

export default function Page() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  
  // Subscribe to global message notifications
  usePusherNotifications(session?.user?.id || null)

  // Handle conversationId from URL query params
  useEffect(() => {
    const conversationIdFromUrl = searchParams.get("conversationId")
    if (conversationIdFromUrl) {
      setSelectedConversationId(conversationIdFromUrl)
    }
  }, [searchParams])

  if (!session?.user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Conversations */}
      <div className="w-80 border-r">
        <RealConversationList
          currentUserId={session.user.id}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>

      {/* Center - Chat Thread */}
      <div className="flex-1">
        {selectedConversationId ? (
          <ChatInterface
            conversationId={selectedConversationId}
            currentUserId={session.user.id}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <MessageSquare className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold">Select a conversation</h3>
            <p className="text-sm text-muted-foreground">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
