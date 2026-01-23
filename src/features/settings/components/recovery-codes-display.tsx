import { Button } from "@/components/ui/button";

interface RecoveryCodesDisplayProps {
	recoveryCodes: string[];
	onDone: () => void;
}

export function RecoveryCodesDisplay({
	recoveryCodes,
	onDone,
}: RecoveryCodesDisplayProps) {
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
