"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard } from "lucide-react";

const navItems = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-3">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-11 w-11 cursor-pointer border-2 border-primary/20 ring-2 ring-primary/10 transition-all hover:border-primary/40 hover:ring-primary/20 hover:scale-105">
                  <AvatarImage 
                    src={session.user.image || ""} 
                    alt={session.user.name || "User"} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-base font-bold">
                    {session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard")}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <NavbarButton
                variant="secondary"
                onClick={() => router.push("/auth/sign-in")}
              >
                Login
              </NavbarButton>
              <NavbarButton
                variant="primary"
                onClick={() => router.push("/auth/sign-up")}
              >
                Sign up
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-nav-${idx}`}
              href={item.link}
              className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-neutral-800 pt-4">
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/20 ring-2 ring-primary/10">
                    <AvatarImage 
                      src={session.user.image || ""} 
                      alt={session.user.name || "User"} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-base font-bold">
                      {session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-white">{session.user.name}</p>
                    <p className="text-xs text-neutral-400">{session.user.email}</p>
                  </div>
                </div>
                <NavbarButton
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </NavbarButton>
                <NavbarButton
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="w-full justify-start bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive border-destructive/30"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/auth/sign-in");
                  }}
                  className="w-full"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  variant="primary"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/auth/sign-up");
                  }}
                  className="w-full"
                >
                  Sign up
                </NavbarButton>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
