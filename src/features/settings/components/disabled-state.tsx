import { Button } from "@/components/ui/button";
import { QrCodeSetup } from "./qr-code-setup";

interface DisabledStateProps {
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
}

export function DisabledState({
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
}: DisabledStateProps) {
	return (
		<>
			<div className="space-y-1">
				<p className="font-medium">
					You have not enabled two-factor authentication.
				</p>
				<p className="text-muted-foreground text-sm">
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
