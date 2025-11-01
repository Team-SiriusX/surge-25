"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Heart, ArrowRightLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

interface NavigationProps {
  currentView: "browse" | "applications" | "saved";
}

export function Navigation({ currentView }: NavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/sign-in");
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/seeker"
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold text-foreground">
              Talent Seeker
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover your next opportunity
            </p>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant={currentView === "browse" ? "default" : "outline"}
              className="gap-2"
            >
              <Link href="/seeker">
                <Briefcase size={18} />
                <span className="hidden sm:inline">Browse Jobs</span>
              </Link>
            </Button>
            <Button
              asChild
              variant={currentView === "applications" ? "default" : "outline"}
              className="gap-2"
            >
              <Link href="/seeker/applications">
                <FileText size={18} />
                <span className="hidden sm:inline">My Applications</span>
              </Link>
            </Button>
            <Button
              asChild
              variant={currentView === "saved" ? "default" : "outline"}
              className="gap-2"
            >
              <Link href="/seeker/saved">
                <Heart size={18} />
                <span className="hidden sm:inline">Saved</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="gap-2">
              <Link href="/seeker/messages">
                <MessageSquare size={18} />
                <span className="hidden sm:inline">Messages</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2 ml-2 pl-2 border-l">
              <NotificationsDropdown />

              <Button asChild variant="secondary" size="sm" className="gap-2">
                <Link href="/finder">
                  <ArrowRightLeft size={16} />
                  <span className="hidden lg:inline">Switch to Finder</span>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session?.user?.image || undefined}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
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
                      <p className="text-sm font-medium leading-none">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
