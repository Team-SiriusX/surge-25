"use client";

import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

export default function FinderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
