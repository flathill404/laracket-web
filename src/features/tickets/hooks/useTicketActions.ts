import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
	addTicketAssignee,
	addTicketReviewer,
	createTicket,
	deleteTicket,
	removeTicketAssignee,
	removeTicketReviewer,
	updateTicket,
	updateTicketOrder,
	updateTicketStatus,
} from "../api/tickets";
import type {
	TicketAssigneeInput,
	TicketOrderInput,
	TicketReviewerInput,
	TicketStatus,
	UpdateTicketInput,
} from "../types";
import { ticketQueries } from "../utils/queries";

export const useTicketActions = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: createTicket,
		onSuccess: (data) => {
			if (data.projectId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.tickets(data.projectId),
				});
			}
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTicketInput }) =>
			updateTicket(id, data),
		onSuccess: (data) => {
			queryClient.invalidateQueries(ticketQueries.detail(data.id));
			if (data.projectId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.tickets(data.projectId),
				});
			}
		},
	});

	const updateStatus = useMutation({
		mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
			updateTicketStatus(id, { status }),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(ticketQueries.detail(id));
			// We might want to invalidate project tickets too if status affects list filtering
			// But we don't know project ID here easily unless we fetch or pass it.
			// Ideally the API would return the ticket so we know projectId.
			// For now, we rely on the component to invalidate list if needed,
			// or we invalidate all tickets lists? No that's too much.
			// Let's rely on basic detail invalidation.
			queryClient.invalidateQueries({
				queryKey: queryKeys.tickets.all(),
			});
		},
	});

	const remove = useMutation({
		mutationFn: ({ id }: { id: string; projectId?: string }) =>
			deleteTicket(id),
		onSuccess: (_, { id, projectId }) => {
			queryClient.removeQueries(ticketQueries.detail(id));
			if (projectId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.tickets(projectId),
				});
			}
		},
	});

	const addAssignee = useMutation({
		mutationFn: ({ id, data }: { id: string; data: TicketAssigneeInput }) =>
			addTicketAssignee(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(ticketQueries.detail(id));
		},
	});

	const removeAssignee = useMutation({
		mutationFn: ({ id, userId }: { id: string; userId: string }) =>
			removeTicketAssignee(id, userId),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(ticketQueries.detail(id));
		},
	});

	const addReviewer = useMutation({
		mutationFn: ({ id, data }: { id: string; data: TicketReviewerInput }) =>
			addTicketReviewer(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(ticketQueries.detail(id));
		},
	});

	const removeReviewer = useMutation({
		mutationFn: ({ id, userId }: { id: string; userId: string }) =>
			removeTicketReviewer(id, userId),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(ticketQueries.detail(id));
		},
	});

	const updateOrder = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: TicketOrderInput;
			projectId?: string;
		}) => updateTicketOrder(id, data),
		onSuccess: (_, { projectId }) => {
			if (projectId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.tickets(projectId),
				});
			}
		},
	});

	return {
		create,
		update,
		updateStatus,
		delete: remove,
		addAssignee,
		removeAssignee,
		addReviewer,
		removeReviewer,
		updateOrder,
	};
};
