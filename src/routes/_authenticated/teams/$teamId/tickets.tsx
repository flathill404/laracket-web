import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { RocketMascot } from "@/components/illustrations/RocketMascot";
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
import { fetchTeam, fetchTeamTickets } from "@/features/teams/api";
import { TicketList } from "@/features/tickets/components/TicketList";

const teamTicketsQuery = (teamId: string) =>
	queryOptions({
		queryKey: ["teams", teamId, "tickets"],
		queryFn: () => fetchTeamTickets(teamId),
	});

const teamQuery = (teamId: string) =>
	queryOptions({
		queryKey: ["teams", teamId],
		queryFn: () => fetchTeam(teamId),
	});

export const Route = createFileRoute("/_authenticated/teams/$teamId/tickets")({
	loader: async ({ context: { queryClient }, params: { teamId } }) => {
		await Promise.all([
			queryClient.ensureQueryData(teamTicketsQuery(teamId)),
			queryClient.ensureQueryData(teamQuery(teamId)),
		]);
	},
	component: TeamDetail,
});

function TeamDetail() {
	const { teamId } = Route.useParams();
	const navigate = useNavigate();
	const { data: tickets } = useSuspenseQuery(teamTicketsQuery(teamId));
	const { data: team } = useSuspenseQuery(teamQuery(teamId));

	return (
		<div className="flex h-full flex-col bg-background">
			{/* Page Header */}
			<div className="flex shrink-0 items-center justify-between border-b px-6 py-5">
				<h1 className="font-semibold text-2xl tracking-tight">{team.name}</h1>
				<div className="flex items-center gap-2">
					<div className="relative w-64">
						<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
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
						to: "/teams/$teamId/tickets/$ticketId",
						params: { teamId, ticketId: ticket.id },
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
								This team has no tickets. Ready to start something new?
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button>
								<Plus className="mr-2 h-4 w-4" /> Create team ticket
							</Button>
						</EmptyContent>
					</Empty>
				}
			/>
			<Outlet />
		</div>
	);
}
