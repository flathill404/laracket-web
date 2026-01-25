import { useQuery } from "@tanstack/react-query";
import { ticketQueries } from "../utils/queries";

export const useTicketActivities = (ticketId: string) => {
	return useQuery(ticketQueries.activities(ticketId));
};
