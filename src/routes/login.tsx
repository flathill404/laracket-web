import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

// mock
const loginApi = async (data: z.infer<typeof loginSchema>) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	if (data.email === "error@example.com") {
		throw new Error("oops!");
	}

	return { token: "fake-jwt-token", user: { name: "User" } };
};

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const router = useRouter();

	const loginMutation = useMutation({
		mutationFn: loginApi,
		onSuccess: () => {
			router.navigate({ to: "/dashboard" });
		},
	});

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: loginSchema,
		},
		onSubmit: async ({ value }) => {
			await loginMutation.mutateAsync(value);
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
									e.stopPropagation();
									form.handleSubmit();
								}}
							>
								<FieldGroup>
									<form.Field
										name="email"
										children={(field) => (
											<Field>
												<FieldLabel htmlFor="email">Email</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="m@example.com"
													type="email"
												/>
												{!field.state.meta.isValid && (
													<FieldError>
														{field.state.meta.errors
															.map((error) => error?.message)
															.join(", ")}
													</FieldError>
												)}
											</Field>
										)}
									/>

									<form.Field
										name="password"
										children={(field) => (
											<Field>
												<FieldLabel htmlFor="password">Password</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													type="password"
												/>
												{!field.state.meta.isValid && (
													<FieldError>
														{field.state.meta.errors.join(", ")}
													</FieldError>
												)}
											</Field>
										)}
									/>

									<Field>
										<Button type="submit" disabled={loginMutation.isPending}>
											{loginMutation.isPending ? "Logging in..." : "Login"}
										</Button>
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
