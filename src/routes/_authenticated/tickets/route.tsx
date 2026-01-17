import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { fetchUserTickets } from "@/api";
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
import { useAuth } from "@/hooks/use-auth";
import { userQueryOptions } from "@/lib/auth";

const userTicketsQuery = (userId: string) =>
	queryOptions({
		queryKey: ["users", userId, "tickets"],
		queryFn: () => fetchUserTickets(userId),
	});

export const Route = createFileRoute("/_authenticated/tickets")({
	loader: async ({ context: { queryClient } }) => {
		const user = await queryClient.ensureQueryData(userQueryOptions);
		if (user) {
			await queryClient.ensureQueryData(userTicketsQuery(user.id));
		}
	},
	component: AllTickets,
});

function AllTickets() {
	const navigate = useNavigate();
	const { user } = useAuth();
	if (!user) {
		throw new Error("User must be defined in authenticated route");
	}

	// We can safely assume user is defined here because of the route protection
	const { data: tickets } = useSuspenseQuery(userTicketsQuery(user.id));

	return (
		<div className="flex flex-col h-full bg-background">
			{/* Page Header */}
			<div className="flex items-center justify-between border-b px-6 py-5 shrink-0">
				<h1 className="text-2xl font-semibold tracking-tight">All Tickets</h1>
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
						to: "/tickets/$ticketId",
						params: { ticketId: ticket.id },
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
								Your ticket queue is empty. Time to relax or start something
								new!
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
