import { revalidateLogic } from "@tanstack/react-form";
import { Link, useRouter } from "@tanstack/react-router";
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
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppForm } from "@/hooks/useAppForm";

const loginFormSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	remember: z.boolean(),
});

interface LoginFormProps {
	redirect?: string;
}

export function LoginForm({ redirect }: LoginFormProps) {
	const router = useRouter();
	const { login } = useAuth();

	const form = useAppForm({
		defaultValues: {
			email: import.meta.env.DEV ? "jeison.stethem@acme.com" : "",
			password: import.meta.env.DEV ? "password" : "",
			remember: false,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: loginFormSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await login(value);
			if (res.twoFactor) {
				await router.navigate({ to: "/two-factor-challenge" });
			} else {
				await router.navigate({ to: redirect || "/dashboard" });
			}
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
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
						<form.AppField
							name="password"
							children={(field) => (
								<div className="flex flex-col gap-2">
									<field.InputField
										label="Password"
										placeholder="********"
										type="password"
									/>
									<div className="flex items-center">
										<Link
											to="/forgot-password"
											className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</Link>
									</div>
								</div>
							)}
						/>
						<form.AppField
							name="remember"
							children={(field) => <field.CheckboxField label="Remember me" />}
						/>
						<Field>
							<form.AppForm>
								<form.SubscribeButton label="Login" />
							</form.AppForm>
							<Button variant="outline" type="button" className="w-full">
								Login with Google
							</Button>
							<FieldDescription className="text-center">
								Don&apos;t have an account?{" "}
								<Link
									to="/register"
									className="font-medium underline underline-offset-4"
								>
									Sign up
								</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
