import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SesMessage } from "./SesPanel";

export function SesEmailDetail({
	message,
	onBack,
}: {
	message: SesMessage;
	onBack: () => void;
}) {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="flex items-center gap-2 border-b p-4">
				<Button variant="ghost" size="icon" onClick={onBack}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h2 className="font-semibold">{message.Subject}</h2>
					<div className="text-muted-foreground text-xs">
						{new Date(message.Timestamp).toLocaleString()}
					</div>
				</div>
			</div>
			<div className="flex-1 space-y-4 overflow-auto p-4">
				<div className="grid gap-2">
					<div className="grid grid-cols-[100px_1fr] gap-2">
						<span className="font-semibold text-sm">From:</span>
						<span className="text-sm">{message.Source}</span>
					</div>
					<div className="grid grid-cols-[100px_1fr] gap-2">
						<span className="font-semibold text-sm">To:</span>
						<span className="text-sm">
							{message.Destination?.ToAddresses?.join(", ")}
						</span>
					</div>
					{message.Destination?.CcAddresses?.length > 0 && (
						<div className="grid grid-cols-[100px_1fr] gap-2">
							<span className="font-semibold text-sm">Cc:</span>
							<span className="text-sm">
								{message.Destination?.CcAddresses?.join(", ")}
							</span>
						</div>
					)}
					{message.Destination?.BccAddresses?.length > 0 && (
						<div className="grid grid-cols-[100px_1fr] gap-2">
							<span className="font-semibold text-sm">Bcc:</span>
							<span className="text-sm">
								{message.Destination?.BccAddresses?.join(", ")}
							</span>
						</div>
					)}
				</div>
				<div className="border-t pt-4">
					{message.Body?.html_part ? (
						<iframe
							srcDoc={message.Body.html_part}
							className="h-96 w-full border-none"
							title="Email Content"
						/>
					) : (
						<pre className="whitespace-pre-wrap font-mono text-sm">
							{message.Body?.text_part ?? "No content"}
						</pre>
					)}
				</div>
			</div>
		</div>
	);
}
