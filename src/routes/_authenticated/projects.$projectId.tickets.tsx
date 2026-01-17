import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Circle, Plus, Search } from "lucide-react";
import { fetchProject, fetchProjectTickets } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const projectQuery = (projectId: string) =>
	queryOptions({
		queryKey: ["projects", projectId],
		queryFn: () => fetchProject(projectId),
	});

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/tickets",
)({
	loader: async ({ context: { queryClient }, params: { projectId } }) => {
		await Promise.all([
			queryClient.ensureQueryData(ticketsQuery(projectId)),
			queryClient.ensureQueryData(projectQuery(projectId)),
		]);
	},
	component: ProjectDetail,
});

function ProjectDetail() {
	const { projectId } = Route.useParams();
	const { data: tickets } = useSuspenseQuery(ticketsQuery(projectId));
	const { data: project } = useSuspenseQuery(projectQuery(projectId));

	return (
		<div className="flex flex-col h-full bg-background">
			{/* Page Header */}
			<div className="flex items-center justify-between border-b px-6 py-5 shrink-0">
				<h1 className="text-2xl font-semibold tracking-tight">
					{project.name}
				</h1>
				<div className="flex items-center gap-2">
					<div className="relative w-64">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search tickets..."
							className="h-9 w-full pl-9"
						/>
					</div>
					<Button>
						<Plus className="mr-2 h-4 w-4" /> New Ticket
					</Button>
				</div>
			</div>

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
							<div
								key={ticket.id}
								className="grid grid-cols-[1fr_100px_140px] items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
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
								<div className="flex items-center gap-2">
									{ticket.assignees.length > 0 ? (
										ticket.assignees.map((assignee) => (
											<div
												key={assignee.id}
												className="flex items-center gap-2"
											>
												<Avatar className="h-6 w-6">
													<AvatarImage src={assignee.avatarUrl} />
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
							</div>
						))}
						{tickets.length === 0 && (
							<div className="p-8 text-center text-muted-foreground">
								No tickets found for this project.
							</div>
						)}
					</div>

					<div className="border-t p-4 text-center text-xs text-muted-foreground bg-card">
						Showing {tickets.length} tickets
					</div>
				</div>
			</div>
		</div>
	);
}
