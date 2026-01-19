import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";
import { updatePassword } from "@/api/auth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formContext, useAppForm } from "@/hooks/use-app-form";

const passwordSchema = z
	.string()
	.min(8, { message: "Password must be at least 8 characters long" })
	.max(20, { message: "Password must be at most 20 characters long" })
	.refine((password) => /[A-Z]/.test(password), {
		message: "Password must contain at least one uppercase letter",
	})
	.refine((password) => /[a-z]/.test(password), {
		message: "Password must contain at least one lowercase letter",
	})
	.refine((password) => /[0-9]/.test(password), {
		message: "Password must contain at least one number",
	})
	.refine((password) => /[!@#$%^&*]/.test(password), {
		message: "Password must contain at least one special character",
	});

export const updatePasswordSchema = z
	.object({
		currentPassword: z.string(),
		password: passwordSchema,
		passwordConfirmation: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords do not match",
		path: ["passwordConfirmation"],
	});

export function PasswordForm() {
	const updatePasswordMutation = useMutation({
		mutationFn: updatePassword,
		onSuccess: () => {
			toast.success("Password updated");
		},
		onError: () => {
			toast.error("Failed to update password");
		},
	});

	const form = useAppForm({
		defaultValues: {
			currentPassword: "",
			password: "",
			passwordConfirmation: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: updatePasswordSchema,
		},
		onSubmit: async ({ value }) => {
			await updatePasswordMutation.mutateAsync(value);
			form.reset();
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Update Password</CardTitle>
				<CardDescription>
					Ensure your account is using a long, random password to stay secure.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<formContext.Provider value={form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-4"
					>
						<form.AppField
							name="currentPassword"
							children={(field) => (
								<field.InputField
									label="Current Password"
									type="password"
									placeholder="Current Password"
								/>
							)}
						/>
						<form.AppField
							name="password"
							children={(field) => (
								<field.InputField
									label="New Password"
									type="password"
									placeholder="New Password"
								/>
							)}
						/>
						<form.AppField
							name="passwordConfirmation"
							children={(field) => (
								<field.InputField
									label="Confirm Password"
									type="password"
									placeholder="Confirm Password"
								/>
							)}
						/>
						<div className="flex justify-end">
							<form.SubscribeButton label="Save" />
						</div>
					</form>
				</formContext.Provider>
			</CardContent>
		</Card>
	);
}
