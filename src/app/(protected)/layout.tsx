// app/(dashboard)/layout.tsx
"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";


export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
 const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})
if (!session) {
    redirect('/auth/sign-in');
}

  return (
    <div className="min-h-screen w-full">
    {children}
    </div>
  );
}