import { client } from "@/lib/client";
import type { Ticket, TicketStatus } from "../types";
import { ticketSchema, ticketsSchema } from "../types/schemas";

export const fetchTicket = async (ticketId: string) => {
	const response = await client.get(`/tickets/${ticketId}`);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const fetchUserTickets = async (userId: string) => {
	const response = await client.get(`/users/${userId}/tickets`);
	const json = await response.json();
	return ticketsSchema.parse(json.data);
};

export const createTicket = async (data: {
	title: string;
	description?: string;
	status?: TicketStatus;
	assigneeIds?: string[];
	reviewerIds?: string[];
	dueDate?: string;
}) => {
	const response = await client.post("/tickets", data);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const updateTicket = async (ticketId: string, data: Partial<Ticket>) => {
	const response = await client.put(`/tickets/${ticketId}`, data);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const updateTicketStatus = async (
	ticketId: string,
	status: TicketStatus,
) => {
	await client.patch(`/tickets/${ticketId}/status`, {
		status,
	});
};

export const addTicketAssignee = async (ticketId: string, userId: string) => {
	await client.post(`/tickets/${ticketId}/assignees`, {
		userId,
	});
};

export const removeTicketAssignee = async (
	ticketId: string,
	userId: string,
) => {
	await client.delete(`/tickets/${ticketId}/assignees/${userId}`);
};

export const addTicketReviewer = async (ticketId: string, userId: string) => {
	await client.post(`/tickets/${ticketId}/reviewers`, {
		userId,
	});
};

export const removeTicketReviewer = async (
	ticketId: string,
	userId: string,
) => {
	await client.delete(`/tickets/${ticketId}/reviewers/${userId}`);
};

export const deleteTicket = async (ticketId: string) => {
	await client.delete(`/tickets/${ticketId}`);
};

export const searchTickets = async (query: string) => {
	const searchParams = new URLSearchParams({ query });
	const response = await client.get(
		`/tickets/search?${searchParams.toString()}`,
	);
	const json = await response.json();
	// Assuming search returns a list of tickets, similar to fetchUserTickets but maybe different structure.
	// Based on typical pattern, it likely returns `data` array.
	return ticketsSchema.parse(json.data);
};

export const updateTicketOrder = async (ticketId: string, order: number) => {
	await client.patch(`/tickets/${ticketId}/order`, { order });
};
