import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicketComment } from "../api/comments";
import { ticketQueries } from "../utils/queries";

export const useTicketCommentActions = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: ({
			ticketId,
			content,
		}: {
			ticketId: string;
			content: string;
		}) => createTicketComment(ticketId, { content }),
		onSuccess: (_, { ticketId }) => {
			queryClient.invalidateQueries(ticketQueries.comments(ticketId));
			queryClient.invalidateQueries(ticketQueries.activities(ticketId));
		},
	});

	return {
		create,
	};
};
