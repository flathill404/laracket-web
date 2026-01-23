import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
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
import {
	sendVerificationEmail,
	updateProfileInformation,
} from "@/features/auth/api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import { queryKeys } from "@/lib/query-keys";

export function VerifyEmail() {
	const { user, logout } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [email, setEmail] = useState(user?.email ?? "");

	const { mutate: resendEmail, isPending: isResending } = useMutationWithToast({
		mutationFn: sendVerificationEmail,
		successMessage: "Verification link sent!",
		errorMessage: "Failed to send verification link.",
	});

	const { mutate: updateEmail, isPending: isUpdating } = useMutationWithToast({
		mutationFn: updateProfileInformation,
		successMessage: "Email updated and verification link sent!",
		errorMessage: "Failed to update email.",
		invalidateKeys: [queryKeys.user()],
		onSuccess: () => {
			setIsEditing(false);
		},
	});

	const handleUpdateEmail = (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		try {
			z.string().email().parse(email);
		} catch {
			toast.error("Please enter a valid email address.");
			return;
		}

		updateEmail({
			displayName: user.displayName ?? "",
			email: email,
		});
	};

	return (
		<div className="flex flex-1 items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Mail className="h-6 w-6 text-primary" />
					</div>
					<CardTitle className="text-2xl">Verify your email</CardTitle>
					<CardDescription>
						Thanks for signing up! Before getting started, could you verify your
						email address by clicking on the link we just emailed to you?
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{isEditing ? (
						<form onSubmit={handleUpdateEmail} className="space-y-2">
							<div className="space-y-1">
								<Input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter new email address"
									required
									autoFocus
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Button type="submit" className="w-full" disabled={isUpdating}>
									{isUpdating ? "Updating..." : "Update Email"}
								</Button>
								<Button
									type="button"
									variant="ghost"
									className="w-full"
									onClick={() => {
										setIsEditing(false);
										setEmail(user?.email ?? "");
									}}
								>
									Cancel
								</Button>
							</div>
						</form>
					) : (
						<div className="flex flex-col gap-4">
							<p className="text-center text-muted-foreground text-sm">
								Current email:{" "}
								<span className="text-foreground">{user?.email}</span>
								<Button
									variant="link"
									className="h-auto px-2 text-primary"
									onClick={() => setIsEditing(true)}
								>
									Edit?
								</Button>
							</p>
							<p className="text-center text-muted-foreground text-sm">
								If you didn't receive the email, we will gladly send you
								another.
							</p>
						</div>
					)}
				</CardContent>
				{!isEditing && (
					<CardFooter className="flex flex-col gap-2">
						<Button
							className="w-full"
							onClick={() => resendEmail()}
							disabled={isResending}
						>
							{isResending ? "Sending..." : "Resend Verification Email"}
						</Button>
						<Button variant="ghost" className="w-full" onClick={() => logout()}>
							Log Out
						</Button>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
