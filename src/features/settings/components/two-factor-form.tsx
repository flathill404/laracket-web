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
import { useTwoFactor } from "../hooks/use-two-factor";

const OTP_LENGTH = 6;

function RecoveryCodesDisplay({
	recoveryCodes,
	onDone,
}: {
	recoveryCodes: string[];
	onDone: () => void;
}) {
	return (
		<div className="space-y-4 rounded-lg bg-muted p-4">
			<div className="space-y-2">
				<p className="font-medium">Recovery Codes</p>
				<p className="text-sm text-muted-foreground">
					Store these recovery codes in a secure password manager. They can be
					used to recover access to your account if your two-factor
					authentication device is lost.
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
			<Button variant="outline" onClick={onDone}>
				Done
			</Button>
		</div>
	);
}

function EnabledState({
	recoveryCodes,
	onShowRecoveryCodes,
	onDisable,
	isDisabling,
	onClearRecoveryCodes,
}: {
	recoveryCodes: string[] | undefined;
	onShowRecoveryCodes: () => void;
	onDisable: () => void;
	isDisabling: boolean;
	onClearRecoveryCodes: () => void;
}) {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<p className="font-medium">
						You have enabled two-factor authentication.
					</p>
					<p className="text-sm text-muted-foreground">
						When two-factor authentication is enabled, you will be prompted for
						a secure, random token during authentication. You may retrieve this
						token from your phone's Google Authenticator application.
					</p>
				</div>
			</div>

			{recoveryCodes ? (
				<RecoveryCodesDisplay
					recoveryCodes={recoveryCodes}
					onDone={onClearRecoveryCodes}
				/>
			) : (
				<div className="flex gap-2">
					<Button variant="outline" onClick={onShowRecoveryCodes}>
						Show Recovery Codes
					</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="destructive">Disable</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Disable Two-Factor Authentication</DialogTitle>
								<DialogDescription>
									Are you sure you want to disable two-factor authentication?
									This will lower the security of your account.
								</DialogDescription>
							</DialogHeader>
							<div className="flex justify-end gap-2">
								<Button variant="ghost">Cancel</Button>
								<Button
									variant="destructive"
									onClick={onDisable}
									disabled={isDisabling}
								>
									Disable
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</>
	);
}

function QrCodeSetup({
	qrCodeSvg,
	confirmationCode,
	onConfirmationCodeChange,
	onConfirm,
	isConfirming,
	onCancel,
	isCancelling,
}: {
	qrCodeSvg: string;
	confirmationCode: string;
	onConfirmationCodeChange: (value: string) => void;
	onConfirm: () => void;
	isConfirming: boolean;
	onCancel: () => void;
	isCancelling: boolean;
}) {
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<p className="font-medium">
					To finish enabling two-factor authentication, scan the following QR
					code using your phone's authenticator application or enter the setup
					key and provide the generated OTP code.
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
						maxLength={OTP_LENGTH}
						value={confirmationCode}
						onChange={onConfirmationCodeChange}
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
						onClick={onConfirm}
						disabled={isConfirming || confirmationCode.length !== OTP_LENGTH}
					>
						Confirm
					</Button>
					<Button variant="ghost" onClick={onCancel} disabled={isCancelling}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}

function DisabledState({
	isPending,
	qrCodeSvg,
	confirmationCode,
	onConfirmationCodeChange,
	onConfirm,
	isConfirming,
	onCancel,
	isCancelling,
	onEnable,
	isEnabling,
}: {
	isPending: boolean;
	qrCodeSvg: string | undefined;
	confirmationCode: string;
	onConfirmationCodeChange: (value: string) => void;
	onConfirm: () => void;
	isConfirming: boolean;
	onCancel: () => void;
	isCancelling: boolean;
	onEnable: () => void;
	isEnabling: boolean;
}) {
	return (
		<>
			<div className="space-y-1">
				<p className="font-medium">
					You have not enabled two-factor authentication.
				</p>
				<p className="text-sm text-muted-foreground">
					When two-factor authentication is enabled, you will be prompted for a
					secure, random token during authentication. You may retrieve this
					token from your phone's Google Authenticator application.
				</p>
			</div>

			{isPending && qrCodeSvg ? (
				<QrCodeSetup
					qrCodeSvg={qrCodeSvg}
					confirmationCode={confirmationCode}
					onConfirmationCodeChange={onConfirmationCodeChange}
					onConfirm={onConfirm}
					isConfirming={isConfirming}
					onCancel={onCancel}
					isCancelling={isCancelling}
				/>
			) : (
				<div className="flex gap-2">
					<Button onClick={onEnable} disabled={isEnabling}>
						Enable
					</Button>
				</div>
			)}
		</>
	);
}

function ConfirmPasswordDialog({
	open,
	onOpenChange,
	password,
	onPasswordChange,
	onConfirm,
	isConfirming,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	password: string;
	onPasswordChange: (value: string) => void;
	onConfirm: () => void;
	isConfirming: boolean;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
							onChange={(e) => onPasswordChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									onConfirm();
								}
							}}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={onConfirm} disabled={isConfirming || !password}>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function TwoFactorForm() {
	const {
		isConfirmed,
		isPending,
		confirmationCode,
		setConfirmationCode,
		confirmPasswordOpen,
		setConfirmPasswordOpen,
		password,
		setPassword,
		recoveryCodes,
		qrCodeSvg,
		enableMutation,
		confirmPasswordMutation,
		confirmMutation,
		disableMutation,
		handleConfirm,
		handleEnableClick,
		handleShowRecoveryCodesClick,
		handlePasswordConfirm,
		clearRecoveryCodes,
	} = useTwoFactor();

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
					<EnabledState
						recoveryCodes={recoveryCodes}
						onShowRecoveryCodes={handleShowRecoveryCodesClick}
						onDisable={() => disableMutation.mutate()}
						isDisabling={disableMutation.isPending}
						onClearRecoveryCodes={clearRecoveryCodes}
					/>
				) : (
					<DisabledState
						isPending={isPending}
						qrCodeSvg={qrCodeSvg}
						confirmationCode={confirmationCode}
						onConfirmationCodeChange={setConfirmationCode}
						onConfirm={handleConfirm}
						isConfirming={confirmMutation.isPending}
						onCancel={() => disableMutation.mutate()}
						isCancelling={disableMutation.isPending}
						onEnable={handleEnableClick}
						isEnabling={enableMutation.isPending}
					/>
				)}

				<ConfirmPasswordDialog
					open={confirmPasswordOpen}
					onOpenChange={setConfirmPasswordOpen}
					password={password}
					onPasswordChange={setPassword}
					onConfirm={handlePasswordConfirm}
					isConfirming={confirmPasswordMutation.isPending}
				/>
			</CardContent>
		</Card>
	);
}
