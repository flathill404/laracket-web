import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTicketComment } from "../api/comments";
import { ticketQueries } from "../utils/queries";

export const useTicketComments = (ticketId: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(ticketQueries.comments(ticketId));

	const createMutation = useMutation({
		mutationFn: (content: string) => createTicketComment(ticketId, { content }),
		onSuccess: () => {
			queryClient.invalidateQueries(ticketQueries.comments(ticketId));
			queryClient.invalidateQueries(ticketQueries.activities(ticketId));
		},
	});

	return {
		...query,
		actions: {
			create: createMutation,
		},
	};
};
