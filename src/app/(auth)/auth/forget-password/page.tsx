"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgetPassword() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		setLoading(true);

		try {
			console.log("🔄 Requesting password reset for:", email);
			
			const result = await authClient.forgetPassword({
				email,
				redirectTo: "/auth/reset-password",
			});

			console.log("📬 Password reset response:", result);

			if (result.error) {
				console.error("❌ Password reset error:", result.error);
				toast.error(result.error.message || "Failed to send reset email");
				setLoading(false);
				return;
			}
			
			console.log("✅ Password reset email sent successfully");
			setEmailSent(true);
			toast.success("Password reset link sent to your email");
		} catch (error: any) {
			console.error("❌ Password reset exception:", error);
			toast.error(error?.message || "Failed to send reset email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (emailSent) {
		return (
			<Card className="z-50 rounded-md max-w-md">
				<CardHeader>
					<div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4 mx-auto">
						<Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
					</div>
					<CardTitle className="text-lg md:text-xl text-center">
						Check your email
					</CardTitle>
					<CardDescription className="text-xs md:text-sm text-center">
						We&apos;ve sent a password reset link to <strong>{email}</strong>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<p className="text-sm text-muted-foreground text-center">
							Didn&apos;t receive the email? Check your spam folder or try again.
						</p>
						<Button
							variant="outline"
							onClick={() => {
								setEmailSent(false);
								setEmail("");
							}}
							className="w-full"
						>
							Try another email
						</Button>
						<Link href="/auth/sign-in" className="w-full">
							<Button variant="ghost" className="w-full gap-2">
								<ArrowLeft className="w-4 h-4" />
								Back to sign in
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="z-50 rounded-md max-w-md">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Forgot Password?</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your email address and we&apos;ll send you a link to reset your password
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleResetPassword}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								"Send reset link"
							)}
						</Button>
						<Link href="/auth/sign-in" className="w-full">
							<Button variant="ghost" className="w-full gap-2">
								<ArrowLeft className="w-4 h-4" />
								Back to sign in
							</Button>
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
