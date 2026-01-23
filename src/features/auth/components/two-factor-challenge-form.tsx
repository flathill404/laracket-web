import { revalidateLogic } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAppForm } from "@/hooks/use-app-form";

const twoFactorFormSchema = z.object({
	code: z.string().length(6),
});

export function TwoFactorChallengeForm() {
	const router = useRouter();
	const { twoFactorChallenge } = useAuth();

	const otpForm = useAppForm({
		defaultValues: {
			code: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: twoFactorFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await twoFactorChallenge({ code: value.code });
				await router.navigate({ to: "/dashboard" });
			} catch {
				toast.error("Failed to verify two-factor authentication code.");
			}
		},
	});

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Two-Factor Authentication</CardTitle>
							<CardDescription>
								Please enter the code from your authenticator app.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									otpForm.handleSubmit();
								}}
							>
								<FieldGroup>
									<otpForm.AppField
										name="code"
										children={(field) => (
											<div className="flex justify-center">
												<InputOTP
													maxLength={6}
													value={field.state.value}
													onChange={(value) => field.handleChange(value)}
												>
													<InputOTPGroup>
														<InputOTPSlot index={0} />
														<InputOTPSlot index={1} />
														<InputOTPSlot index={2} />
														<InputOTPSlot index={3} />
														<InputOTPSlot index={4} />
														<InputOTPSlot index={5} />
													</InputOTPGroup>
												</InputOTP>
											</div>
										)}
									/>
									<Field>
										<otpForm.AppForm>
											<otpForm.SubscribeButton label="Verify" />
										</otpForm.AppForm>
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
