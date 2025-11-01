"use client"

import { Navigation } from "./_components/navigation"
import { usePathname } from "next/navigation"

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Determine current view from pathname
  const getCurrentView = (): "browse" | "applications" | "saved" => {
    if (pathname.includes("/applications")) return "applications"
    if (pathname.includes("/saved")) return "saved"
    return "browse"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={getCurrentView()} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
