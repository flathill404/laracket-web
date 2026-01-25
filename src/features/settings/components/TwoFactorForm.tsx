import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTwoFactor } from "../hooks/useTwoFactor";
import { ConfirmPasswordDialog } from "./ConfirmPasswordDialog";
import { DisabledState } from "./DisabledState";
import { EnabledState } from "./EnabledState";

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
