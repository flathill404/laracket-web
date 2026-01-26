import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { TicketList } from "@/features/tickets/components/TicketList";
import { useInfiniteSearchTickets } from "@/features/tickets/hooks/useInfiniteSearchTickets";
import { ticketQueries } from "@/features/tickets/utils/queries";

const searchParamsSchema = z.object({
	q: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/search")({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search: { q } }) => ({ q }),
	loader: ({ context, deps: { q } }) => {
		if (q) {
			context.queryClient.ensureInfiniteQueryData(ticketQueries.search(q));
		}
	},
	component: SearchRoute,
});

function SearchRoute() {
	const { q } = Route.useSearch();
	const navigate = useNavigate();

	const {
		data: tickets,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		isLoading,
	} = useInfiniteSearchTickets(q || "");

	if (!q) {
		return (
			<div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
				Please enter a search term in the header.
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b bg-card px-6 py-4">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Search Results</h1>
					<p className="text-muted-foreground text-sm">
						Showing results for &quot;{q}&quot;
					</p>
				</div>
			</div>

			<TicketList
				pages={tickets?.pages ?? []}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
				isLoading={isLoading}
				onTicketClick={(ticket) => {
					navigate({
						to: "/projects/$projectId/tickets/$ticketId",
						params: {
							projectId: ticket.projectId,
							ticketId: ticket.id,
						},
					});
				}}
				emptyState={
					<div className="flex flex-col items-center gap-2">
						<p className="font-medium text-lg">No tickets found</p>
						<p className="text-muted-foreground">
							We couldn't find any tickets matching &quot;{q}&quot;
						</p>
					</div>
				}
			/>
		</div>
	);
}
