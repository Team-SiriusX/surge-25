"use client";

import { Navigation } from "./_components/navigation";
import { usePathname } from "next/navigation";

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMessagesPage = pathname.includes("/messages");

  // Determine current view from pathname
  const getCurrentView = (): "browse" | "applications" | "saved" => {
    if (pathname.includes("/applications")) return "applications";
    if (pathname.includes("/saved")) return "saved";
    return "browse";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation currentView={getCurrentView()} />
      <main className={isMessagesPage ? "flex-1 flex flex-col" : "mx-auto max-w-7xl px-4 py-8"}>
        {children}
      </main>
    </div>
  );
}
