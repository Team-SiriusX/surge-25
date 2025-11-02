import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Header from "@/components/layout/header";
import InitialLoader from "@/components/ui/initial-loader";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Uni Connect",
  description: "Connect with your university community",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        <InitialLoader />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
