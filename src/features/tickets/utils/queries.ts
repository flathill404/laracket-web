import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchProjectTickets } from "@/features/projects/api/tickets";
import { queryKeys } from "@/lib/queryKeys";
import { fetchTicketActivities } from "../api/activities";
import { fetchTicketComments } from "../api/comments";
import { fetchTicket, searchTickets } from "../api/tickets";
import type { TicketListOptions } from "../types";

export const ticketQueries = {
	list: (projectId: string, options?: TicketListOptions) =>
		infiniteQueryOptions({
			queryKey: queryKeys.projects.ticketsInfinite(projectId, options),
			queryFn: ({ pageParam }) =>
				fetchProjectTickets(projectId, {
					filters: { status: options?.status },
					sort: options?.sort,
					pagination: { cursor: pageParam },
				}),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
		}),

	detail: (ticketId: string) =>
		queryOptions({
			queryKey: queryKeys.tickets.detail(ticketId),
			queryFn: () => fetchTicket(ticketId),
			enabled: !!ticketId,
		}),

	activities: (ticketId: string) =>
		queryOptions({
			queryKey: queryKeys.tickets.activities(ticketId),
			queryFn: () => fetchTicketActivities(ticketId),
			enabled: !!ticketId,
		}),

	comments: (ticketId: string) =>
		queryOptions({
			queryKey: queryKeys.tickets.comments(ticketId),
			queryFn: () => fetchTicketComments(ticketId),
			enabled: !!ticketId,
		}),

	search: (q: string) =>
		infiniteQueryOptions({
			queryKey: queryKeys.tickets.search(q),
			queryFn: ({ pageParam }) => searchTickets(q, pageParam),
			initialPageParam: null as string | null,
			getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
			enabled: !!q,
		}),
};
