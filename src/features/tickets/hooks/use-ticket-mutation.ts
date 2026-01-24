import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { z } from "zod";
import { projectTicketsQueryKey, ticketQueryOptions } from "../api/queries";
import type { ticketSchema } from "../api/tickets";

type Ticket = z.infer<typeof ticketSchema>;

export const useTicketMutation = <TVariables>(
	ticketId: string,
	projectId: string,
	mutationFn: (variables: TVariables) => Promise<unknown>,
	updater: (old: Ticket, variables: TVariables) => Ticket,
) => {
	const queryClient = useQueryClient();

	const updateCache = useCallback(
		(cacheUpdater: (old: Ticket) => Ticket) => {
			queryClient.setQueryData(
				ticketQueryOptions(ticketId).queryKey,
				(old: Ticket | undefined) => (old ? cacheUpdater(old) : old),
			);
			queryClient.invalidateQueries({
				queryKey: projectTicketsQueryKey(projectId),
			});
			queryClient.invalidateQueries({
				queryKey: ticketQueryOptions(ticketId).queryKey,
			});
		},
		[queryClient, ticketId, projectId],
	);

	const mutation = useMutation({
		mutationFn,
		onSuccess: (_, variables) => {
			updateCache((old) => updater(old, variables));
		},
	});

	return { ...mutation, updateCache };
};
