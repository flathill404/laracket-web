import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { RecoveryCodesDisplay } from "./recovery-codes-display";

interface EnabledStateProps {
	recoveryCodes: string[] | undefined;
	onShowRecoveryCodes: () => void;
	onDisable: () => void;
	isDisabling: boolean;
	onClearRecoveryCodes: () => void;
}

export function EnabledState({
	recoveryCodes,
	onShowRecoveryCodes,
	onDisable,
	isDisabling,
	onClearRecoveryCodes,
}: EnabledStateProps) {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<p className="font-medium">
						You have enabled two-factor authentication.
					</p>
					<p className="text-muted-foreground text-sm">
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
