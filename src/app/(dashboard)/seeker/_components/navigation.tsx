"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Heart, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

interface NavigationProps {
  currentView: "browse" | "applications" | "saved";
}

export function Navigation({ currentView }: NavigationProps) {
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

          <div className="flex gap-2">
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

            <Button
              asChild
              variant="secondary"
              className="gap-2 ml-2"
            >
              <Link href="/finder">
                <ArrowRightLeft size={18} />
                <span className="hidden sm:inline">Switch to Finder</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
