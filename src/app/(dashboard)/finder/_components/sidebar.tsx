"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, MessageSquare, ArrowRightLeft, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      console.log('Window width:', window.innerWidth, 'isMobile:', mobile)
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Log state changes
  useEffect(() => {
    console.log('Sidebar state - isOpen:', isOpen, 'isMobile:', isMobile)
  }, [isOpen, isMobile])

  const navItems = [
    { href: "/finder", label: "Dashboard", icon: LayoutDashboard },
    { href: "/finder/posts", label: "My Posts", icon: FileText },
    {href: "/messages" , label: "Messages", icon: MessageSquare },
  ]

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      onClose()
    }
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobile, isOpen])

  // Don't render until we know if it's mobile or not
  if (isMobile === null) {
    return (
      <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-col">
        {/* Placeholder for SSR */}
      </aside>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col",
          // Mobile styles
          isMobile && "fixed inset-y-0 left-0 z-[110] transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          // Desktop styles
          !isMobile && "relative"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Talent Finder</h1>
            <p className="text-sm text-white mt-1">Post & Recruit</p>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10 lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
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
          <p className="text-xs text-white text-center">© 2025 Uni Connect</p>
        </div>
      </aside>
    </>
  )
}
