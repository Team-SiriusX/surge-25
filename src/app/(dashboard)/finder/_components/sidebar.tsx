"use client"

import { LayoutDashboard, FileText, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

type NavigationItem = "dashboard" | "posts" | "messages"

interface SidebarProps {
  activeNav: NavigationItem
  onNavigate: (item: NavigationItem) => void
}

export function Sidebar({ activeNav, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "posts" as const, label: "My Posts", icon: FileText },
    { id: "messages" as const, label: "Messages", icon: MessageSquare },
  ]

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold">Talent Finder</h1>
        <p className="text-sm text-sidebar-accent mt-1">Post & Recruit</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-accent hover:bg-sidebar-border",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-accent text-center">© 2025 Talent Finder</p>
      </div>
    </aside>
  )
}
