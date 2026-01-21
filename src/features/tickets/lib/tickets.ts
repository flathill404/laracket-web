import { queryOptions } from "@tanstack/react-query";
import { fetchTicket } from "../api/tickets";

export const ticketQueryOptions = (ticketId: string) =>
	queryOptions({
		queryKey: ["tickets", ticketId],
		queryFn: () => fetchTicket(ticketId),
	});

export const projectTicketsQueryKey = (projectId: string) =>
	["projects", projectId, "tickets"] as const;
