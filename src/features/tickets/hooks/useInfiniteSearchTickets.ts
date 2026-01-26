import { useInfiniteQuery } from "@tanstack/react-query";
import { ticketQueries } from "../utils/queries";

export function useInfiniteSearchTickets(q: string) {
	return useInfiniteQuery({
		...ticketQueries.search(q),
	});
}
