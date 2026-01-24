import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmPasswordDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	password: string;
	onPasswordChange: (value: string) => void;
	onConfirm: () => void;
	isConfirming: boolean;
}

export function ConfirmPasswordDialog({
	open,
	onOpenChange,
	password,
	onPasswordChange,
	onConfirm,
	isConfirming,
}: ConfirmPasswordDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Password</DialogTitle>
					<DialogDescription>
						For your security, please confirm your password to continue.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
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
