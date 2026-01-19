import { revalidateLogic } from "@tanstack/react-form";

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
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
import { useAppForm } from "@/hooks/use-app-form";
import { useAuth } from "@/hooks/use-auth";

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/_guest/login")({
	validateSearch: loginSearchSchema,
	component: LoginPage,
});

const loginFormSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	remember: z.boolean(),
});

function LoginPage() {
	const router = useRouter();

	const { login } = useAuth();
	const search = Route.useSearch();

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: loginFormSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await login(value);
			if (res.two_factor) {
				await router.navigate({ to: "/two-factor-challenge" });
			} else {
				await router.navigate({ to: search.redirect || "/dashboard" });
			}
		},
	});

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Login to your account</CardTitle>
							<CardDescription>
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
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
											<field.InputField
												label="password"
												placeholder="m@example.com"
												type="password"
											/>
										)}
									/>
									<form.AppField
										name="remember"
										children={(field) => (
											<field.CheckboxField label="Remember me" />
										)}
									/>
									<Field>
										<form.AppForm>
											<form.SubscribeButton label="Login" />
										</form.AppForm>
										<Button variant="outline" type="button">
											Login with Google
										</Button>
										<FieldDescription className="text-center">
											Don&apos;t have an account? <Link to="/wip">Sign up</Link>
										</FieldDescription>
									</Field>
								</FieldGroup>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
