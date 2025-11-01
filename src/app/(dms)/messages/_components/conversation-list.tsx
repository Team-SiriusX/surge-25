"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface ConversationListProps {
  conversations: any[]
  selectedId: string
  onSelectConversation: (conversation: any) => void
  users: any[]
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelectConversation,
  users,
}: ConversationListProps) {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getOtherUser = (conversation: any) => {
    return users.find((user) => user.id !== "current-user")
  }

  const filteredConversations = conversations.filter((conv) => {
    if (searchQuery) {
      const otherUser = getOtherUser(conv)
      return (
        otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.jobPost?.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  return (
    <div className="w-1/4 border-r border-border flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground mb-4">Messages</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="flex-1"
          >
            Unread
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const otherUser = getOtherUser(conversation)
          const isSelected = conversation.id === selectedId
          const unreadCount = Math.floor(Math.random() * 3)

          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-border cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={otherUser?.image || "/placeholder.svg"} alt={otherUser?.name} />
                    <AvatarFallback>
                      {otherUser?.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`truncate ${unreadCount > 0 ? "font-semibold" : "font-medium"}`}>
                      {otherUser?.name}
                    </h3>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.jobPost?.title || "Direct message"}
                  </p>
                  <p className="text-xs text-muted-foreground">2:45 PM</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
