import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { queryKeys } from "@/lib/queryKeys";
import {
	addTicketAssignee,
	addTicketReviewer,
	deleteTicket,
	removeTicketAssignee,
	removeTicketReviewer,
	updateTicket,
	updateTicketStatus,
} from "../api/tickets";
import type {
	Ticket,
	TicketStatus,
	TicketUser,
	UpdateTicketInput,
} from "../types";
import { ticketQueries } from "../utils/queries";

export const useTicket = (ticketId: string, projectId?: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(ticketQueries.detail(ticketId));

	const updateCache = useCallback(
		(updater: (old: Ticket) => Ticket) => {
			queryClient.setQueryData(
				ticketQueries.detail(ticketId).queryKey,
				(old: Ticket | undefined) => (old ? updater(old) : old),
			);
			if (projectId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.tickets(projectId),
				});
			}
		},
		[queryClient, ticketId, projectId],
	);

	const invalidate = useCallback(() => {
		queryClient.invalidateQueries(ticketQueries.detail(ticketId));
		if (projectId) {
			queryClient.invalidateQueries({
				queryKey: queryKeys.projects.tickets(projectId),
			});
		}
	}, [queryClient, ticketId, projectId]);

	const updateMutation = useMutation({
		mutationFn: (input: UpdateTicketInput) => updateTicket(ticketId, input),
		onSuccess: (updatedTicket) => {
			updateCache(() => updatedTicket);
		},
	});

	const updateStatusMutation = useMutation({
		mutationFn: (status: TicketStatus) =>
			updateTicketStatus(ticketId, { status }),
		onSuccess: (_, status) => {
			updateCache((old) => ({ ...old, status }));
		},
	});

	const addAssigneeMutation = useMutation({
		mutationFn: (user: TicketUser) =>
			addTicketAssignee(ticketId, { userId: user.id }),
		onSuccess: (_, user) => {
			updateCache((old) => ({ ...old, assignees: [...old.assignees, user] }));
		},
	});

	const removeAssigneeMutation = useMutation({
		mutationFn: (userId: string) => removeTicketAssignee(ticketId, userId),
		onSuccess: (_, userId) => {
			updateCache((old) => ({
				...old,
				assignees: old.assignees.filter((a) => a.id !== userId),
			}));
		},
	});

	const addReviewerMutation = useMutation({
		mutationFn: (user: TicketUser) =>
			addTicketReviewer(ticketId, { userId: user.id }),
		onSuccess: (_, user) => {
			updateCache((old) => ({ ...old, reviewers: [...old.reviewers, user] }));
		},
	});

	const removeReviewerMutation = useMutation({
		mutationFn: (userId: string) => removeTicketReviewer(ticketId, userId),
		onSuccess: (_, userId) => {
			updateCache((old) => ({
				...old,
				reviewers: old.reviewers.filter((r) => r.id !== userId),
			}));
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteTicket(ticketId),
		onSuccess: () => {
			queryClient.removeQueries(ticketQueries.detail(ticketId));
			if (projectId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.tickets(projectId),
				});
			}
		},
	});

	return {
		...query,
		updateCache,
		invalidate,
		actions: {
			update: updateMutation,
			updateStatus: updateStatusMutation,
			addAssignee: addAssigneeMutation,
			removeAssignee: removeAssigneeMutation,
			addReviewer: addReviewerMutation,
			removeReviewer: removeReviewerMutation,
			delete: deleteMutation,
		},
	};
};
