"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { DashboardView } from "./views/dashboard-view"
import { PostsView } from "./views/posts-view"
import { MessagesView } from "./views/messages-view"

type NavigationItem = "dashboard" | "posts" | "messages"

export function Dashboard({ onCreatePost }: { onCreatePost: () => void }) {
  const [activeNav, setActiveNav] = useState<NavigationItem>("dashboard")

  const renderView = () => {
    switch (activeNav) {
      case "posts":
        return <PostsView onCreatePost={onCreatePost} />
      case "messages":
        return <MessagesView />
      default:
        return <DashboardView onCreatePost={onCreatePost} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeNav={activeNav} onNavigate={setActiveNav} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto">{renderView()}</div>
      </div>
    </div>
  )
}
