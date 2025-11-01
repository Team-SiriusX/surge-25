"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Target,
  Heart,
  LinkIcon,
  FileText,
  Award,
  LogOut,
  Home,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProfileSidebarProps {
  open: boolean;
  profile: {
    name: string;
    email: string;
    image: string | null;
  } | null;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  section: string;
}

export function ProfileSidebar({ open, profile, activeSection, setActiveSection }: ProfileSidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const links: SidebarLink[] = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0" />,
      section: "home",
    },
    {
      label: "Find Jobs",
      href: "/finder",
      icon: <Briefcase className="h-5 w-5 shrink-0" />,
      section: "jobs",
    },
    {
      label: "Personal Info",
      href: "#personal",
      icon: <User className="h-5 w-5 shrink-0" />,
      section: "personal",
    },
    {
      label: "Skills",
      href: "#skills",
      icon: <Target className="h-5 w-5 shrink-0" />,
      section: "skills",
    },
    {
      label: "Interests",
      href: "#interests",
      icon: <Heart className="h-5 w-5 shrink-0" />,
      section: "interests",
    },
    {
      label: "Resume",
      href: "#resume",
      icon: <FileText className="h-5 w-5 shrink-0" />,
      section: "resume",
    },
    {
      label: "Social Links",
      href: "#social",
      icon: <LinkIcon className="h-5 w-5 shrink-0" />,
      section: "social",
    },
    {
      label: "Profile Score",
      href: "#score",
      icon: <Award className="h-5 w-5 shrink-0" />,
      section: "score",
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
      {open ? <Logo /> : <LogoIcon />}
      <div className="mt-8 flex flex-col gap-2">
        {links.map((link, idx) => (
          <SidebarLinkComponent
            key={idx}
            link={link}
            isActive={activeSection === link.section}
            onClick={() => {
              if (link.href.startsWith("#")) {
                setActiveSection(link.section);
                const element = document.getElementById(link.section);
                element?.scrollIntoView({ behavior: "smooth", block: "start" });
              } else {
                router.push(link.href);
              }
            }}
          />
        ))}
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            "text-neutral-700 hover:bg-red-50 hover:text-red-600 dark:text-neutral-200 dark:hover:bg-red-950/20 dark:hover:text-red-400"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <div className="h-6 w-6 shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-semibold text-black dark:text-white"
      >
        UniConnect
      </motion.span>
    </Link>
  );
}

function LogoIcon() {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <div className="h-6 w-6 shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary" />
    </Link>
  );
}

function SidebarLinkComponent({
  link,
  isActive,
  onClick,
}: {
  link: SidebarLink;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-sm dark:from-primary/20 dark:to-secondary/20"
          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
      )}
    >
      <div className={cn(isActive && "text-primary")}>{link.icon}</div>
      <span>{link.label}</span>
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="ml-auto h-2 w-2 rounded-full bg-primary"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
    </button>
  );
}

export function UserProfileCard({ profile }: { profile: { name: string; email: string; image: string | null } | null }) {
  if (!profile) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 backdrop-blur-sm transition-colors hover:bg-muted/50">
      <Avatar className="h-9 w-9 border-2 border-primary/20">
        <AvatarImage src={profile.image || ""} alt={profile.name} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-xs font-semibold text-white">
          {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-semibold text-foreground">{profile.name}</p>
        <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
      </div>
    </div>
  );
}
