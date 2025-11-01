"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
        onError: (ctx) => {
          console.error("Sign out error:", ctx.error);
        },
      },
    });
    setLoading(false);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>Welcome back, {session?.user?.name || "User"}!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{session?.user?.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{session?.user?.name}</p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSignOut} 
                variant="destructive" 
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
