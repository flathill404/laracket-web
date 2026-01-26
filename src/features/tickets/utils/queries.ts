import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTicketActivities } from "../api/activities";
import { fetchTicketComments } from "../api/comments";
import { fetchTicket, searchTickets } from "../api/tickets";

export const ticketQueries = {
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

	search: (keyword: string) =>
		queryOptions({
			queryKey: queryKeys.tickets.search(keyword),
			queryFn: () => searchTickets(keyword),
			enabled: !!keyword,
		}),
};
