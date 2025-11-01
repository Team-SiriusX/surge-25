"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmail() {
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
	const [message, setMessage] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const token = searchParams.get("token");
		const error = searchParams.get("error");

		if (error) {
			setStatus("error");
			setMessage(error === "invalid_token" ? "Invalid or expired verification link" : "Verification failed");
		} else if (!token) {
			setStatus("error");
			setMessage("No verification token provided");
		} else {
			// If we have a token and no error, verification was successful
			setStatus("success");
			setMessage("Your email has been verified successfully!");
		}
	}, [searchParams]);

	if (status === "loading") {
		return (
			<Card className="z-50 rounded-md max-w-md">
				<CardHeader>
					<div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4 mx-auto">
						<Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
					</div>
					<CardTitle className="text-lg md:text-xl text-center">
						Verifying your email...
					</CardTitle>
					<CardDescription className="text-xs md:text-sm text-center">
						Please wait while we verify your email address
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (status === "error") {
		return (
			<Card className="z-50 rounded-md max-w-md">
				<CardHeader>
					<div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4 mx-auto">
						<XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
					</div>
					<CardTitle className="text-lg md:text-xl text-center">
						Verification Failed
					</CardTitle>
					<CardDescription className="text-xs md:text-sm text-center">
						{message}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<p className="text-sm text-muted-foreground text-center">
							The verification link may have expired or is invalid. Please request a new verification email.
						</p>
						<Link href="/auth/sign-in" className="w-full">
							<Button className="w-full">Go to Sign In</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="z-50 rounded-md max-w-md">
			<CardHeader>
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4 mx-auto">
					<CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
				</div>
				<CardTitle className="text-lg md:text-xl text-center">
					Email Verified!
				</CardTitle>
				<CardDescription className="text-xs md:text-sm text-center">
					{message}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<p className="text-sm text-muted-foreground text-center">
						You can now sign in to your account with your credentials.
					</p>
					<Link href="/auth/sign-in" className="w-full">
						<Button className="w-full">Continue to Sign In</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
