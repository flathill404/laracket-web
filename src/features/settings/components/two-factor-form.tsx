import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
	confirmPassword,
	confirmTwoFactor,
	disableTwoFactor,
	enableTwoFactor,
	fetchTwoFactorQrCode,
	fetchTwoFactorRecoveryCodes,
} from "@/features/auth/api/auth";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function TwoFactorForm() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [confirmationCode, setConfirmationCode] = useState("");
	const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [pendingAction, setPendingAction] = useState<
		"enable" | "show-recovery-codes" | null
	>(null);

	const isConfirmed = user?.twoFactorStatus === "enabled";
	const isPending = user?.twoFactorStatus === "pending";

	const { data: recoveryCodes, refetch: refetchRecoveryCodes } = useQuery({
		queryKey: ["recovery-codes"],
		queryFn: fetchTwoFactorRecoveryCodes,
		enabled: false,
	});

	const { data: qrCodeSvg } = useQuery({
		queryKey: ["two-factor-qr-code"],
		queryFn: async () => {
			const { svg } = await fetchTwoFactorQrCode();
			return svg;
		},
		enabled: isPending,
	});

	const enableMutation = useMutation({
		mutationFn: enableTwoFactor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to enable two-factor authentication");
		},
	});

	const confirmPasswordMutation = useMutation({
		mutationFn: confirmPassword,
		onSuccess: () => {
			setConfirmPasswordOpen(false);
			setPassword("");
			if (pendingAction === "enable") {
				enableMutation.mutate();
			} else if (pendingAction === "show-recovery-codes") {
				refetchRecoveryCodes();
			}
			setPendingAction(null);
		},
		onError: () => {
			toast.error("Incorrect password");
		},
	});

	const confirmMutation = useMutation({
		mutationFn: confirmTwoFactor,
		onSuccess: async () => {
			toast.success("Two-factor authentication enabled");
			refetchRecoveryCodes();
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
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to disable two-factor authentication");
		},
	});

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
				{isConfirmed ? (
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
									onClick={() =>
										queryClient.setQueryData(["recovery-codes"], null)
									}
								>
									Done
								</Button>
							</div>
						) : (
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={() => {
										setPendingAction("show-recovery-codes");
										setConfirmPasswordOpen(true);
									}}
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

						{isPending && qrCodeSvg ? (
							<div className="space-y-6">
								<div className="space-y-4">
									<p className="font-medium">
										To finish enabling two-factor authentication, scan the
										following QR code using your phone's authenticator
										application or enter the setup key and provide the generated
										OTP code.
									</p>
									<img
										className="p-4 bg-white w-fit rounded-lg"
										src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCodeSvg)}`}
										alt="2FA QR Code"
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
											onClick={() => disableMutation.mutate()}
											disabled={disableMutation.isPending}
										>
											Cancel
										</Button>
									</div>
								</div>
							</div>
						) : (
							<div className="flex gap-2">
								<Button
									onClick={() => {
										setPendingAction("enable");
										setConfirmPasswordOpen(true);
									}}
									disabled={enableMutation.isPending}
								>
									Enable
								</Button>
							</div>
						)}
					</>
				)}

				<Dialog
					open={confirmPasswordOpen}
					onOpenChange={setConfirmPasswordOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Password</DialogTitle>
							<DialogDescription>
								For your security, please confirm your password to continue.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-2">
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									type="password"
									id="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											confirmPasswordMutation.mutate({ password });
										}
									}}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setConfirmPasswordOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={() => confirmPasswordMutation.mutate({ password })}
								disabled={confirmPasswordMutation.isPending || !password}
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
