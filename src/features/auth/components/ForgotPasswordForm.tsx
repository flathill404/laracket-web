import { revalidateLogic } from "@tanstack/react-form";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppForm } from "@/hooks/use-app-form";

const forgotPasswordSchema = z.object({
	email: z.email(),
});

export function ForgotPasswordForm() {
	const router = useRouter();
	const { forgotPassword } = useAuth();

	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: forgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			await forgotPassword(value);
			toast.success("Password reset link sent to your email");
			await router.navigate({ to: "/login" });
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Forgot Password</CardTitle>
				<CardDescription>
					Enter your email address and we will send you a password reset link.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					noValidate
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.AppField
							name="email"
							children={(field) => (
								<field.InputField
									label="Email"
									placeholder="m@example.com"
									type="email"
								/>
							)}
						/>
						<Field>
							<form.AppForm>
								<form.SubscribeButton label="Email Password Reset Link" />
							</form.AppForm>
							<Link
								to="/login"
								className="flex w-full justify-center font-medium text-muted-foreground text-sm hover:underline"
							>
								Back to Login
							</Link>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
