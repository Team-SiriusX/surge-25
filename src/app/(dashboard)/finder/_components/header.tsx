"use client"

import { Search, Settings, ArrowLeft, User, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/sign-in");
  };

  return (
    <header className="border-b border-border bg-card px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            console.log('Menu button clicked!')
            onMenuClick()
          }}
          className="shrink-0 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Back Button - Hidden on mobile when search is expanded */}
        {(!isMobile || !searchExpanded) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Search Bar */}
        <div
          className={cn(
            "relative transition-all duration-200",
            isMobile && searchExpanded ? "flex-1" : "flex-1 max-w-sm",
            isMobile && !searchExpanded && "hidden sm:flex"
          )}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            onFocus={() => isMobile && setSearchExpanded(true)}
            onBlur={() => isMobile && setSearchExpanded(false)}
          />
        </div>

        {/* Search Button - Mobile Only */}
        {isMobile && !searchExpanded && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchExpanded(true)}
            className="shrink-0 sm:hidden"
          >
            <Search className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Right Section - Hidden when search is expanded on mobile */}
      {(!isMobile || !searchExpanded) && (
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationsDropdown />
          
          {/* Settings - Hidden on mobile */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs sm:text-sm">
                    {session?.user?.name
                      ? session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : session?.user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {/* Settings in menu for mobile */}
              <DropdownMenuItem className="cursor-pointer sm:hidden">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  )
}
