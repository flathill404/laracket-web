import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchProjectTickets } from "@/features/projects/api/tickets";
import type { FetchTicketsOptions } from "@/features/projects/types";
import { queryKeys } from "@/lib/queryKeys";
import { fetchTicketActivities } from "../api/activities";
import { fetchTicketComments } from "../api/comments";
import { fetchTicket, searchTickets } from "../api/tickets";

export const ticketQueries = {
	list: (
		projectId: string,
		options?: Omit<FetchTicketsOptions, "pagination">,
	) =>
		infiniteQueryOptions({
			queryKey: queryKeys.projects.ticketsInfinite(projectId, options),
			queryFn: ({ pageParam }) =>
				fetchProjectTickets(projectId, {
					...options,
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
