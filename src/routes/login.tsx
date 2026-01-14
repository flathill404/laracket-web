import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
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

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: loginSchema,
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
