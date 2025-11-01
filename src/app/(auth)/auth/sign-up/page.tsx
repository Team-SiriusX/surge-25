"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-md"
		>
			{/* Card Container */}
			<div className="relative rounded-2xl border border-neutral-800 bg-black/50 p-8 backdrop-blur-xl">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-3xl font-bold text-white">Create Account</h1>
					<p className="text-sm text-neutral-500">
						Join CampusConnect and start building your future
					</p>
				</div>

				{/* Form */}
				<div className="space-y-4">
					{/* Name Fields */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label htmlFor="first-name" className="text-sm font-medium text-neutral-300">
								First name
							</Label>
							<Input
								id="first-name"
								placeholder="Ahmed"
								required
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
								className="border-neutral-800 bg-neutral-950/50 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="last-name" className="text-sm font-medium text-neutral-300">
								Last name
							</Label>
							<Input
								id="last-name"
								placeholder="Ali"
								required
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
								className="border-neutral-800 bg-neutral-950/50 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					{/* Email Input */}
					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-medium text-neutral-300">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="your@email.com"
							required
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							className="border-neutral-800 bg-neutral-950/50 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					{/* Password Input */}
					<div className="space-y-2">
						<Label htmlFor="password" className="text-sm font-medium text-neutral-300">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="••••••••"
							className="border-neutral-800 bg-neutral-950/50 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					{/* Confirm Password Input */}
					<div className="space-y-2">
						<Label htmlFor="password_confirmation" className="text-sm font-medium text-neutral-300">
							Confirm Password
						</Label>
						<Input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="••••••••"
							className="border-neutral-800 bg-neutral-950/50 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					{/* Profile Image Upload */}
					<div className="space-y-2">
						<Label htmlFor="image" className="text-sm font-medium text-neutral-300">
							Profile Image <span className="text-neutral-600">(optional)</span>
						</Label>
						<div className="flex items-end gap-3">
							{imagePreview && (
								<div className="relative h-14 w-14 overflow-hidden rounded-lg ring-1 ring-neutral-800">
									<Image
										src={imagePreview}
										alt="Profile preview"
										fill
										className="object-cover"
									/>
								</div>
							)}
							<div className="flex flex-1 items-center gap-2">
								<Input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="flex-1 border-neutral-800 bg-neutral-950/50 text-neutral-400 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
								/>
								{imagePreview && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => {
											setImage(null);
											setImagePreview(null);
										}}
										className="h-9 w-9 text-neutral-500 hover:text-white"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Create Account Button */}
					<Button
						type="submit"
						className="w-full bg-blue-600 font-medium text-white hover:bg-blue-700"
						disabled={loading}
						onClick={async () => {
							await signUp.email({
								email,
								password,
								name: `${firstName} ${lastName}`,
								image: image ? await convertImageToBase64(image) : "",
								callbackURL: "/seeker",
								fetchOptions: {
									onResponse: () => setLoading(false),
									onRequest: () => setLoading(true),
									onError: (ctx) => {
										toast.error(ctx.error.message);
									},
									onSuccess: async () => {
										toast.success("Account created! Please check your email to verify your account.");
										router.push("/auth/sign-in");
									},
								},
							});
						}}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"Create Account"
						)}
					</Button>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-neutral-800" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-black px-2 text-neutral-600">Or continue with</span>
						</div>
					</div>

					{/* Social Login Buttons */}
					<div className="grid grid-cols-2 gap-3">
						<Button
							variant="outline"
							className="border-neutral-800 bg-neutral-950/50 text-neutral-300 hover:bg-neutral-900 hover:text-white"
							disabled={loading}
							onClick={async () => {
								await signIn.social(
									{
										provider: "google",
										callbackURL: "/seeker",
									},
									{
										onRequest: () => setLoading(true),
										onResponse: () => setLoading(false),
										onError: (ctx: any) => {
											toast.error(ctx.error?.message || "Failed to sign in with Google");
											setLoading(false);
										},
									}
								);
							}}
						>
							{loading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									viewBox="0 0 256 262"
								>
									<path
										fill="#4285F4"
										d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
									/>
									<path
										fill="#34A853"
										d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
									/>
									<path
										fill="#FBBC05"
										d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
									/>
									<path
										fill="#EB4335"
										d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
									/>
								</svg>
							)}
							Google
						</Button>
						<Button
							variant="outline"
							className="border-neutral-800 bg-neutral-950/50 text-neutral-300 hover:bg-neutral-900 hover:text-white"
							disabled={loading}
							onClick={async () => {
								await signIn.social(
									{
										provider: "github",
										callbackURL: "/seeker",
									},
									{
										onRequest: () => setLoading(true),
										onResponse: () => setLoading(false),
										onError: (ctx: any) => {
											toast.error(ctx.error?.message || "Failed to sign in with GitHub");
											setLoading(false);
										},
									}
								);
							}}
						>
							{loading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
									/>
								</svg>
							)}
							GitHub
						</Button>
					</div>
				</div>

				{/* Sign In Link */}
				<div className="mt-8 text-center">
					<p className="text-sm text-neutral-500">
						Already have an account?{" "}
						<Link
							href="/auth/sign-in"
							className="font-medium text-blue-500 transition-colors hover:text-blue-400"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</motion.div>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}