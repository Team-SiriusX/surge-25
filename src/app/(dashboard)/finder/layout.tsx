"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

export default function FinderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('Layout - sidebarOpen:', sidebarOpen)
  }, [sidebarOpen])

  return (
    <div className="flex h-screen bg-background relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => {
          console.log('Layout - opening sidebar')
          setSidebarOpen(true)
        }} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
