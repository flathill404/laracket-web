import { Circle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStatusColor, getStatusLabel } from "@/lib/ticket-utils";

// Using a loose type for now to match the existing usage, but ideally this should be a shared type from the API
export interface Ticket {
	id: string;
	title: string;
	description: string;
	status: string;
	assignees: Array<{
		id: string;
		name: string;
		avatarUrl?: string | null;
	}>;
	// Add other fields if needed for display
	// Allow for extra properties from the API response
	// biome-ignore lint/suspicious/noExplicitAny: allow loose typing for ticket
	[key: string]: any;
}

interface TicketListProps {
	tickets: Ticket[];
	onTicketClick: (ticket: Ticket) => void;
	emptyState?: React.ReactNode;
}

export function TicketList({
	tickets,
	onTicketClick,
	emptyState,
}: TicketListProps) {
	return (
		<div className="flex-1 overflow-hidden bg-muted/5 p-6">
			<div className="flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
				{/* Table Header */}
				<div className="grid grid-cols-[1fr_100px_140px] items-center gap-4 border-b px-6 py-3 text-xs font-medium text-muted-foreground bg-muted/30">
					<div>Subject</div>
					<div>Status</div>
					<div>Assignee</div>
				</div>

				{/* Ticket Rows */}
				<div className="flex-1 overflow-auto divide-y">
					{tickets.map((ticket) => (
						<button
							key={ticket.id}
							onClick={() => onTicketClick(ticket)}
							type="button"
							className="grid w-full text-left grid-cols-[1fr_100px_140px] items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:bg-muted/50"
						>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="font-medium">
										[T-{ticket.id.slice(0, 8)}] {ticket.title}
									</span>
								</div>
								<span className="text-xs text-muted-foreground line-clamp-1">
									{ticket.description}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Circle
									className={`h-3 w-3 ${getStatusColor(ticket.status)}`}
								/>
								<span className="text-sm">{getStatusLabel(ticket.status)}</span>
							</div>
							<div className="flex items-center gap-2">
								{ticket.assignees.length > 0 ? (
									ticket.assignees.map((assignee) => (
										<div key={assignee.id} className="flex items-center gap-2">
											<Avatar className="h-6 w-6">
												<AvatarImage src={assignee.avatarUrl ?? undefined} />
												<AvatarFallback className="text-[10px]">
													{assignee.name.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm text-muted-foreground">
												{assignee.name}
											</span>
										</div>
									))
								) : (
									<span className="text-sm text-muted-foreground">
										Unassigned
									</span>
								)}
							</div>
						</button>
					))}
					{tickets.length === 0 && emptyState}
				</div>

				<div className="border-t p-4 text-center text-xs text-muted-foreground bg-card">
					Showing {tickets.length} tickets
				</div>
			</div>
		</div>
	);
}
