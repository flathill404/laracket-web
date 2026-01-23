import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTicketActivities } from "../api/activities";
import { fetchTicket } from "../api/tickets";

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

/** @deprecated Use queryKeys.projects.tickets(projectId) instead */
export const projectTicketsQueryKey = (projectId: string) =>
	queryKeys.projects.tickets(projectId);
