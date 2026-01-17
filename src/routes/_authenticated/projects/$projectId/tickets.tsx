import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { fetchProject, fetchProjectTickets } from "@/api";
import { RocketMascot } from "@/components/illustrations/rocket-mascot";
import { TicketList } from "@/components/tickets/ticket-list";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

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
	const navigate = useNavigate();
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

			<TicketList
				tickets={tickets}
				onTicketClick={(ticket) =>
					navigate({
						to: ticket.id,
						params: { projectId, ticketId: ticket.id },
					})
				}
				emptyState={
					<Empty>
						<EmptyMedia>
							<RocketMascot className="size-24" />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>No tickets yet!</EmptyTitle>
							<EmptyDescription>
								Everything is looking clean. Ready to blast off with a new task?
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button>
								<Plus className="mr-2 h-4 w-4" /> Create your first ticket
							</Button>
						</EmptyContent>
					</Empty>
				}
			/>
			<Outlet />
		</div>
	);
}
