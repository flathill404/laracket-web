import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Circle } from "lucide-react";
import { fetchProjectTickets } from "@/api";

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

const ticketsQuery = (projectId: string) =>
	queryOptions({
		queryKey: ["projects", projectId, "tickets"],
		queryFn: () => fetchProjectTickets(projectId),
	});

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/tickets",
)({
	loader: ({ context: { queryClient }, params: { projectId } }) =>
		queryClient.ensureQueryData(ticketsQuery(projectId)),
	component: ProjectDetail,
});

function ProjectDetail() {
	const { projectId } = Route.useParams();
	const { data: tickets } = useSuspenseQuery(ticketsQuery(projectId));

	return (
		<div className="flex flex-col h-full bg-background">
			<div className="flex-1 overflow-auto bg-muted/5 p-6">
				<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
					{/* Table Header */}
					<div className="grid grid-cols-[1fr_100px_140px_140px] items-center gap-4 border-b px-6 py-3 text-xs font-medium text-muted-foreground">
						<div>Subject</div>
						<div>Status</div>
						<div>Priority</div>
						<div>Assignee</div>
					</div>

					{/* Ticket Rows */}
					<div className="divide-y">
						{tickets.map((ticket) => (
							<div
								key={ticket.id}
								className="grid grid-cols-[1fr_100px_140px_140px] items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
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
									<span className="text-sm">
										{getStatusLabel(ticket.status)}
									</span>
								</div>
								{/* TODO: Add priority to API/Schema */}
								<div className="text-sm text-muted-foreground">-</div>
								<div className="flex items-center gap-2">
									{ticket.assignees.length > 0 ? (
										ticket.assignees.map((assignee) => (
											<div
												key={assignee.id}
												className="flex items-center gap-2"
											>
												<div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
													{assignee.name.slice(0, 2).toUpperCase()}
												</div>
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
							</div>
						))}
						{tickets.length === 0 && (
							<div className="p-8 text-center text-muted-foreground">
								No tickets found for this project.
							</div>
						)}
					</div>

					<div className="border-t p-4 text-center text-xs text-muted-foreground">
						Showing {tickets.length} tickets
					</div>
				</div>
			</div>
		</div>
	);
}
