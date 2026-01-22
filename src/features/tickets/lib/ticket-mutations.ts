import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import type { ticketSchema } from "../api/tickets";
import { projectTicketsQueryKey, ticketQueryOptions } from "./tickets";

type Ticket = z.infer<typeof ticketSchema>;

export const updateTicketCache = (
	queryClient: ReturnType<typeof useQueryClient>,
	ticketId: string,
	projectId: string,
	updater: (old: Ticket) => Ticket,
) => {
	queryClient.setQueryData(
		ticketQueryOptions(ticketId).queryKey,
		(old: Ticket | undefined) => (old ? updater(old) : old),
	);
	queryClient.invalidateQueries({
		queryKey: projectTicketsQueryKey(projectId),
	});
	queryClient.invalidateQueries({
		queryKey: ticketQueryOptions(ticketId).queryKey,
	});
};

export const useTicketMutation = <TVariables>(
	ticketId: string,
	projectId: string,
	mutationFn: (variables: TVariables) => Promise<unknown>,
	updater: (old: Ticket, variables: TVariables) => Ticket,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn,
		onSuccess: (_, variables) => {
			updateTicketCache(queryClient, ticketId, projectId, (old) =>
				updater(old, variables),
			);
		},
	});
};
