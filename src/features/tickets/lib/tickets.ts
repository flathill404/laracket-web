import { queryOptions } from "@tanstack/react-query";
import { fetchTicket } from "../api/tickets";

export const ticketQueryOptions = (ticketId: string) =>
	queryOptions({
		queryKey: ["tickets", ticketId],
		queryFn: () => fetchTicket(ticketId),
	});
