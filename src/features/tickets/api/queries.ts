import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTicketActivities } from "./activities";
import { fetchTicket } from "./tickets";

export const ticketQueryOptions = (ticketId: string) =>
	queryOptions({
		queryKey: queryKeys.tickets.detail(ticketId),
		queryFn: () => fetchTicket(ticketId),
	});

export const ticketActivitiesQueryOptions = (ticketId: string) =>
	queryOptions({
		queryKey: queryKeys.tickets.activities(ticketId),
		queryFn: () => fetchTicketActivities(ticketId),
	});
