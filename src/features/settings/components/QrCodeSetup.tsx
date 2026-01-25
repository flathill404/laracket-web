import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

const OTP_LENGTH = 6;

interface QrCodeSetupProps {
	qrCodeSvg: string;
	confirmationCode: string;
	onConfirmationCodeChange: (value: string) => void;
	onConfirm: () => void;
	isConfirming: boolean;
	onCancel: () => void;
	isCancelling: boolean;
}

export function QrCodeSetup({
	qrCodeSvg,
	confirmationCode,
	onConfirmationCodeChange,
	onConfirm,
	isConfirming,
	onCancel,
	isCancelling,
}: QrCodeSetupProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<p className="font-medium">
					To finish enabling two-factor authentication, scan the following QR
					code using your phone's authenticator application or enter the setup
					key and provide the generated OTP code.
				</p>
				<img
					className="w-fit rounded-lg bg-white p-4"
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
