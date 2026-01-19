import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { sendVerificationEmail } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/verify-email")({
	component: VerifyEmail,
});

function VerifyEmail() {
	const { logout } = useAuth();

	const { mutate: resendEmail, isPending } = useMutation({
		mutationFn: sendVerificationEmail,
		onSuccess: () => {
			toast.success("Verification link sent!");
		},
		onError: () => {
			toast.error("Failed to send verification link.");
		},
	});

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
					<p className="text-center text-sm text-muted-foreground">
						If you didn't receive the email, we will gladly send you another.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Button
						className="w-full"
						onClick={() => resendEmail()}
						disabled={isPending}
					>
						{isPending ? "Sending..." : "Resend Verification Email"}
					</Button>
					<Button variant="ghost" className="w-full" onClick={() => logout()}>
						Log Out
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
