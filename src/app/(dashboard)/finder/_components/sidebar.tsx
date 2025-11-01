"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, MessageSquare, ArrowRightLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/finder", label: "Dashboard", icon: LayoutDashboard },
    { href: "/finder/posts", label: "My Posts", icon: FileText },
  ]

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white">
        <h1 className="text-2xl font-bold">Talent Finder</h1>
        <p className="text-sm text-white mt-1">Post & Recruit</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-white hover:bg-sidebar-border",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white space-y-3">
        <Link href="/seeker" className="block">
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Switch to Seeker
          </Button>
        </Link>
        <p className="text-xs text-white text-center">© 2025 Talent Finder</p>
      </div>
    </aside>
  )
}
