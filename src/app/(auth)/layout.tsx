import type { Metadata } from "next";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black/[0.96] antialiased">
      {/* Grid Background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none [background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      {/* Spotlight Effects */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <Spotlight
        className="-top-40 right-0 md:-top-20 md:right-60"
        fill="white"
        mirror={true}
      />

      {/* Logo/Header */}
      <div className="absolute left-8 top-8 z-50">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 transition-all group-hover:shadow-blue-500/50">
              <span className="text-xl font-bold text-white">U</span>
            </div>
            <div className="flex flex-col">
              <h1 className="bg-gradient-to-r from-neutral-50 to-neutral-400 bg-clip-text text-xl font-bold text-transparent transition-all group-hover:from-blue-400 group-hover:to-purple-400">
                Uni Connect
              </h1>
              <span className="text-[10px] text-neutral-500">Campus Marketplace</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 pt-24 md:pt-4">
        {children}
      </div>
    </div>
  );
}