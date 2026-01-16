import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import {
	confirmTwoFactor,
	disableTwoFactor,
	enableTwoFactor,
	fetchTwoFactorQrCode,
	fetchTwoFactorRecoveryCodes,
} from "@/lib/api/auth";

export function TwoFactorForm() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [isSetupMode, setIsSetupMode] = useState(false);
	const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
	const [confirmationCode, setConfirmationCode] = useState("");
	const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

	const enableMutation = useMutation({
		mutationFn: async () => {
			await enableTwoFactor();
			const { svg } = await fetchTwoFactorQrCode();
			return svg;
		},
		onSuccess: (svg) => {
			setQrCodeSvg(svg);
			setIsSetupMode(true);
		},
		onError: () => {
			toast.error("Failed to enable two-factor authentication");
		},
	});

	const confirmMutation = useMutation({
		mutationFn: confirmTwoFactor,
		onSuccess: async () => {
			toast.success("Two-factor authentication enabled");
			const codes = await fetchTwoFactorRecoveryCodes();
			setRecoveryCodes(codes);
			setIsSetupMode(false);
			setQrCodeSvg(null);
			setConfirmationCode("");
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to confirm two-factor authentication");
		},
	});

	const disableMutation = useMutation({
		mutationFn: disableTwoFactor,
		onSuccess: () => {
			toast.success("Two-factor authentication disabled");
			setRecoveryCodes(null);
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to disable two-factor authentication");
		},
	});

	const getRecoveryCodesMutation = useMutation({
		mutationFn: fetchTwoFactorRecoveryCodes,
		onSuccess: (codes) => {
			setRecoveryCodes(codes);
		},
		onError: () => {
			toast.error("Failed to get recovery codes");
		},
	});

	const isEnabled = !!user?.two_factor_confirmed_at;

	const handleConfirm = () => {
		if (confirmationCode.length === 6) {
			confirmMutation.mutate({ code: confirmationCode });
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Two-Factor Authentication</CardTitle>
				<CardDescription>
					Add additional security to your account using two-factor
					authentication.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{isEnabled ? (
					<>
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="font-medium">
									You have enabled two-factor authentication.
								</p>
								<p className="text-sm text-muted-foreground">
									When two-factor authentication is enabled, you will be
									prompted for a secure, random token during authentication. You
									may retrieve this token from your phone's Google Authenticator
									application.
								</p>
							</div>
						</div>

						{recoveryCodes ? (
							<div className="space-y-4 rounded-lg bg-muted p-4">
								<div className="space-y-2">
									<p className="font-medium">Recovery Codes</p>
									<p className="text-sm text-muted-foreground">
										Store these recovery codes in a secure password manager.
										They can be used to recover access to your account if your
										two-factor authentication device is lost.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-2 text-sm font-mono sm:grid-cols-4">
									{recoveryCodes.map((code) => (
										<div
											key={code}
											className="bg-background p-2 rounded border text-center"
										>
											{code}
										</div>
									))}
								</div>
								<Button
									variant="outline"
									onClick={() => setRecoveryCodes(null)}
								>
									Done
								</Button>
							</div>
						) : (
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={() => getRecoveryCodesMutation.mutate()}
									disabled={getRecoveryCodesMutation.isPending}
								>
									Show Recovery Codes
								</Button>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="destructive">Disable</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												Disable Two-Factor Authentication
											</DialogTitle>
											<DialogDescription>
												Are you sure you want to disable two-factor
												authentication? This will lower the security of your
												account.
											</DialogDescription>
										</DialogHeader>
										<div className="flex justify-end gap-2">
											<Button variant="ghost">Cancel</Button>
											<Button
												variant="destructive"
												onClick={() => disableMutation.mutate()}
												disabled={disableMutation.isPending}
											>
												Disable
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						)}
					</>
				) : (
					<>
						<div className="space-y-1">
							<p className="font-medium">
								You have not enabled two-factor authentication.
							</p>
							<p className="text-sm text-muted-foreground">
								When two-factor authentication is enabled, you will be prompted
								for a secure, random token during authentication. You may
								retrieve this token from your phone's Google Authenticator
								application.
							</p>
						</div>

						{isSetupMode && qrCodeSvg ? (
							<div className="space-y-6">
								<div className="space-y-4">
									<p className="font-medium">
										To finish enabling two-factor authentication, scan the
										following QR code using your phone's authenticator
										application or enter the setup key and provide the generated
										OTP code.
									</p>
									<div
										className="p-4 bg-white w-fit rounded-lg"
										dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
									/>
								</div>

								<div className="space-y-2">
									<Label>Code</Label>
									<div className="flex items-center gap-4">
										<InputOTP
											maxLength={6}
											value={confirmationCode}
											onChange={setConfirmationCode}
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
										<Button
											onClick={handleConfirm}
											disabled={
												confirmMutation.isPending ||
												confirmationCode.length !== 6
											}
										>
											Confirm
										</Button>
										<Button
											variant="ghost"
											onClick={() => {
												setIsSetupMode(false);
												setQrCodeSvg(null);
												setConfirmationCode("");
											}}
										>
											Cancel
										</Button>
									</div>
								</div>
							</div>
						) : (
							<Button
								onClick={() => enableMutation.mutate()}
								disabled={enableMutation.isPending}
							>
								Enable
							</Button>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
