import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import * as React from "react";
import { RocketMascot } from "@/components/illustrations/rocket-mascot";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { authQueries } from "@/features/auth/utils/queries";
import { fetchUserTickets } from "@/features/tickets/api/tickets";
import { TicketList } from "@/features/tickets/components/TicketList";

const userTicketsQuery = (userId: string) =>
	queryOptions({
		queryKey: ["users", userId, "tickets"],
		queryFn: () => fetchUserTickets(userId),
	});

export const Route = createFileRoute("/_authenticated/my-work")({
	loader: async ({ context: { queryClient } }) => {
		const user = await queryClient.ensureQueryData(authQueries.user());
		if (user) {
			await queryClient.ensureQueryData(userTicketsQuery(user.id));
		}
	},
	component: MyWork,
});

function MyWork() {
	const navigate = useNavigate();
	const { data: user } = useSuspenseQuery(authQueries.user());
	if (!user) {
		throw new Error("User must be defined in authenticated route");
	}

	// We can safely assume user is defined here because of the route protection
	const { data: allTickets } = useSuspenseQuery(userTicketsQuery(user.id));

	// Filter tickets where user is assignee or reviewer
	const myTickets = React.useMemo(() => {
		return allTickets.filter((ticket) => {
			const isAssignee = ticket.assignees.some((a) => a.id === user.id);
			const isReviewer = ticket.reviewers.some((r) => r.id === user.id);
			return isAssignee || isReviewer;
		});
	}, [allTickets, user]);

	return (
		<div className="flex h-full flex-col bg-background">
			{/* Page Header */}
			<div className="flex shrink-0 items-center justify-between border-b px-6 py-5">
				<h1 className="font-semibold text-2xl tracking-tight">My Work</h1>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> New Ticket
				</Button>
			</div>

			{/* Content List View */}
			<TicketList
				tickets={myTickets}
				onTicketClick={(ticket) =>
					navigate({
						// Relative path that should work for general ticket viewing, or specific route?
						// In the original file it was: "/tickets/$ticketId"
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
							<EmptyTitle>No active work</EmptyTitle>
							<EmptyDescription>
								Your plate is clean! Check "All Tickets" to find something new
								to pick up.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button onClick={() => navigate({ to: "/tickets" })}>
								Browse Requests
							</Button>
						</EmptyContent>
					</Empty>
				}
			/>
		</div>
	);
}
