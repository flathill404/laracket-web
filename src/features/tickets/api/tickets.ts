import { client } from "@/lib/client";
import type { Ticket, TicketStatus } from "../types";
import { ticketSchema, ticketsSchema } from "../types/schemas";

// Re-export types
export type {
	Assignee,
	PaginatedTicketsResponse,
	Reviewer,
	TicketStatus as TicketStatusType,
	TicketUser,
} from "../types";

// API Functions
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
