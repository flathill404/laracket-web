import type { Ticket } from "./types";

export function SubjectCell({ ticket }: { ticket: Ticket }) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<span className="font-medium">
					[T-{ticket.id.slice(-8)}] {ticket.title}
				</span>
			</div>
			<span className="text-xs text-muted-foreground line-clamp-1">
				{ticket.description}
			</span>
		</div>
	);
}
