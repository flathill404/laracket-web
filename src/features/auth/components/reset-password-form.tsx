import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { GuestFormLayout } from "@/components/layout/guest-form-layout";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAppForm } from "@/hooks/use-app-form";

const resetPasswordSchema = z
	.object({
		password: z.string().min(8),
		passwordConfirmation: z.string().min(8),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords do not match",
		path: ["passwordConfirmation"],
	});

interface ResetPasswordFormProps {
	email: string;
	token: string;
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
	const navigate = useNavigate();
	const { resetPassword } = useAuth();

	const form = useAppForm({
		defaultValues: {
			password: "",
			passwordConfirmation: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: resetPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			await resetPassword({
				email,
				token,
				password: value.password,
				passwordConfirmation: value.passwordConfirmation,
			});
			toast.success("Password reset successfully. Please login.");
			await navigate({ to: "/login" });
		},
	});

	return (
		<GuestFormLayout>
			<Card>
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>Enter your new password.</CardDescription>
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
								name="password"
								children={(field) => (
									<field.InputField
										label="Password"
										type="password"
										placeholder="********"
									/>
								)}
							/>
							<form.AppField
								name="passwordConfirmation"
								children={(field) => (
									<field.InputField
										label="Confirm Password"
										type="password"
										placeholder="********"
									/>
								)}
							/>
							<Field>
								<form.AppForm>
									<form.SubscribeButton label="Reset Password" />
								</form.AppForm>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</GuestFormLayout>
	);
}
