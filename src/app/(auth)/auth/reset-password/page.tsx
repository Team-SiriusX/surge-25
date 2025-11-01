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
import { useState, useEffect, Suspense } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

function ResetPasswordForm() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [tokenError, setTokenError] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const error = searchParams.get("error");

	useEffect(() => {
		// Check for error in URL (invalid/expired token)
		if (error === "INVALID_TOKEN" || error === "invalid_token") {
			setTokenError(true);
			toast.error("Invalid or expired reset link");
		} else if (!token) {
			setTokenError(true);
			toast.error("No reset token provided");
		}
	}, [token, error]);

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!token) {
			toast.error("Invalid reset link");
			return;
		}

		if (!password || !confirmPassword) {
			toast.error("Please fill in all fields");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}

		setLoading(true);

		try {
			const { error } = await authClient.resetPassword({
				newPassword: password,
				token: token,
			});

			if (error) {
				toast.error(error.message || "Failed to reset password");
				setLoading(false);
				return;
			}

			setSuccess(true);
			toast.success("Password reset successfully!");
			
			setTimeout(() => {
				router.push("/auth/sign-in");
			}, 2000);
		} catch (error: any) {
			toast.error(error?.message || "Failed to reset password. Please try again.");
			setLoading(false);
		}
	};

	if (success) {
		return (
			<Card className="z-50 rounded-md max-w-md">
				<CardHeader>
					<div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4 mx-auto">
						<CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
					</div>
					<CardTitle className="text-lg md:text-xl text-center">
						Password Reset Successful
					</CardTitle>
					<CardDescription className="text-xs md:text-sm text-center">
						Your password has been successfully reset. Redirecting to sign in...
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="z-50 rounded-md max-w-md">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your new password below
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleResetPassword}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="password">New Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter new password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
								minLength={8}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Confirm new password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								disabled={loading}
								minLength={8}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Resetting...
								</>
							) : (
								"Reset Password"
							)}
						</Button>
						<Link href="/auth/sign-in" className="w-full">
							<Button variant="ghost" className="w-full" type="button">
								Back to sign in
							</Button>
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={
			<Card className="z-50 rounded-md max-w-md">
				<CardContent className="flex items-center justify-center p-8">
					<Loader2 className="w-8 h-8 animate-spin" />
				</CardContent>
			</Card>
		}>
			<ResetPasswordForm />
		</Suspense>
	);
}
