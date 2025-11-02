"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ConversationList as RealConversationList } from "@/components/chat/conversation-list"
import { useSession } from "@/lib/auth-client"
import { usePusherNotifications } from "@/hooks/use-pusher-notifications"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Page() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Subscribe to global message notifications
  usePusherNotifications(session?.user?.id || null)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle conversationId from URL query params
  useEffect(() => {
    const conversationIdFromUrl = searchParams.get("conversationId")
    if (conversationIdFromUrl) {
      setSelectedConversationId(conversationIdFromUrl)
    }
  }, [searchParams])

  const handleBackToList = () => {
    setSelectedConversationId(null)
  }

  if (!session?.user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Conversations (hide on mobile when chat selected) */}
      <div className={cn(
        "w-full md:w-80 border-r flex",
        isMobile && selectedConversationId && "hidden"
      )}>
        <RealConversationList
          currentUserId={session.user.id}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>

      {/* Center - Chat Thread (show on desktop always, on mobile only when chat selected) */}
      <div className={cn(
        "flex-1 flex",
        isMobile && !selectedConversationId && "hidden"
      )}>
        {selectedConversationId ? (
          <ChatInterface
            conversationId={selectedConversationId}
            currentUserId={session.user.id}
            onBack={isMobile ? handleBackToList : undefined}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-4">
            <MessageSquare className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold text-center">Select a conversation</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
