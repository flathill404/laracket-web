import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// In a real app, you might use a form library like react-hook-form + zod
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email");
		const password = formData.get("password");

		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Assuming we have access to auth context via router context
			// Note: In TanStack Router, accessing context like this depends on how it's passed.
			// Based on __root.tsx, we have an 'auth' object in context.
			// @ts-ignore - Verify context typing if needed, but for now assuming it matches __root.tsx
			const auth = router.state.context.auth;

			if (auth && auth.login) {
				auth.login(email); // Pass user info if needed
			}

			// Redirect to dashboard or previous location
			// We can get search params for redirect URL if we implemented that in _auth.tsx
			// For now, hardcode to dashboard as requested/implied
			await router.navigate({ to: "/dashboard" });
		} catch (err) {
			setError("Failed to login. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleLogin}>
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" name="password" type="password" required />
						</div>
						{error && (
							<div className="text-sm text-red-500 font-medium">{error}</div>
						)}
					</CardContent>
					<CardFooter>
						<Button className="w-full" type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Sign in
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
