import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Circle } from "lucide-react";
import { fetchTicket } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

// Helper to define types for the status based on the API
const getStatusColor = (status: string) => {
	switch (status) {
		case "open":
		case "reopened":
			return "text-green-500 fill-green-500";
		case "in_progress":
			return "text-yellow-500 fill-yellow-500";
		case "resolved":
		case "closed":
			return "text-slate-500 fill-slate-500";
		case "in_review":
			return "text-blue-500 fill-blue-500";
		default:
			return "text-slate-500 fill-slate-500";
	}
};

const getStatusLabel = (status: string) => {
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const ticketQuery = (ticketId: string) =>
	queryOptions({
		queryKey: ["tickets", ticketId],
		queryFn: () => fetchTicket(ticketId),
	});

export interface TicketDetailDialogProps {
	ticketId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TicketDetailDialog({
	ticketId,
	open,
	onOpenChange,
}: TicketDetailDialogProps) {
	const { data: ticket } = useSuspenseQuery(ticketQuery(ticketId));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<div className="flex items-center gap-2 mb-2">
						<span className="text-sm font-medium text-muted-foreground mr-auto">
							[T-{ticket.id.slice(0, 8)}]
						</span>
						<div className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
							<Circle className={`h-2 w-2 ${getStatusColor(ticket.status)}`} />
							{getStatusLabel(ticket.status)}
						</div>
					</div>
					<DialogTitle className="text-xl">{ticket.title}</DialogTitle>
					<DialogDescription>
						Created at {new Date(ticket.createdAt).toLocaleDateString()}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					<div className="space-y-4">
						<div className="prose prose-sm max-w-none text-muted-foreground">
							{ticket.description}
						</div>
					</div>

					<div className="space-y-2">
						<h4 className="text-sm font-medium leading-none">Assignees</h4>
						<div className="flex flex-wrap gap-2">
							{ticket.assignees.length > 0 ? (
								ticket.assignees.map((assignee) => (
									<div
										key={assignee.id}
										className="flex items-center gap-2 rounded-full border px-3 py-1"
									>
										<Avatar className="h-5 w-5">
											<AvatarImage src={assignee.avatarUrl ?? undefined} />
											<AvatarFallback className="text-[10px]">
												{assignee.name.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm">{assignee.name}</span>
									</div>
								))
							) : (
								<span className="text-sm text-muted-foreground">
									Unassigned
								</span>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
