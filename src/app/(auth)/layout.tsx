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

      {/* Logo */}
      <div className="absolute left-8 top-8 z-50">
        <Link href="/" className="group flex items-center gap-2">
          <h1 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-500">
            CampusConnect
          </h1>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}