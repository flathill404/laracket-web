import { revalidateLogic } from "@tanstack/react-form";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAppForm } from "@/hooks/use-app-form";

const registerSchema = z
	.object({
		name: z.string().min(1, "Username is required"),
		displayName: z.string().min(1, "Display name is required"),
		email: z.email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		passwordConfirmation: z.string().min(8),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords do not match",
		path: ["passwordConfirmation"],
	});

export function RegisterForm() {
	const router = useRouter();
	const { register } = useAuth();

	const form = useAppForm({
		defaultValues: {
			name: "",
			displayName: "",
			email: "",
			password: "",
			passwordConfirmation: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: registerSchema,
		},
		onSubmit: async ({ value }) => {
			await register(value);
			toast.success("Account created successfully");
			// Redirect to dashboard (or verification notice if needed)
			await router.navigate({ to: "/dashboard" });
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your details below to create your account
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
							name="name"
							children={(field) => (
								<field.InputField
									label="Username"
									placeholder="jdoe"
									description="This will be used for login."
								/>
							)}
						/>
						<form.AppField
							name="displayName"
							children={(field) => (
								<field.InputField label="Display Name" placeholder="John Doe" />
							)}
						/>
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
								<form.SubscribeButton label="Register" />
							</form.AppForm>
							<Button variant="outline" type="button">
								Sign up with Google
							</Button>
							<FieldDescription className="text-center">
								Already have an account?{" "}
								<Link
									to="/login"
									className="font-medium underline underline-offset-4"
								>
									Login
								</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
