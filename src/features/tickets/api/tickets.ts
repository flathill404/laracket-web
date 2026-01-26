import { client } from "@/lib/client";
import type {
	CreateTicketInput,
	TicketAssigneeInput,
	TicketOrderInput,
	TicketReviewerInput,
	UpdateTicketInput,
	UpdateTicketStatusInput,
} from "../types";
import {
	simplePaginatedTicketsSchema,
	ticketSchema,
	ticketsSchema,
} from "../types/schemas";

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

export const createTicket = async (input: CreateTicketInput) => {
	const response = await client.post("/tickets", input);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const updateTicket = async (
	ticketId: string,
	input: UpdateTicketInput,
) => {
	const response = await client.put(`/tickets/${ticketId}`, input);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const updateTicketStatus = async (
	ticketId: string,
	input: UpdateTicketStatusInput,
) => {
	await client.patch(`/tickets/${ticketId}/status`, input);
};

export const addTicketAssignee = async (
	ticketId: string,
	input: TicketAssigneeInput,
) => {
	await client.post(`/tickets/${ticketId}/assignees`, input);
};

export const removeTicketAssignee = async (
	ticketId: string,
	userId: string,
) => {
	await client.delete(`/tickets/${ticketId}/assignees/${userId}`);
};

export const addTicketReviewer = async (
	ticketId: string,
	input: TicketReviewerInput,
) => {
	await client.post(`/tickets/${ticketId}/reviewers`, input);
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

export const searchTickets = async (q: string, page = 1) => {
	const searchParams = new URLSearchParams({
		q,
		page: page.toString(),
	});
	const response = await client.get(
		`/tickets/search?${searchParams.toString()}`,
	);
	const json = await response.json();
	// simplePaginate return { data: [...], links: {...}, meta: {...} }
	return simplePaginatedTicketsSchema.parse(json);
};

export const updateTicketOrder = async (
	ticketId: string,
	input: TicketOrderInput,
) => {
	await client.patch(`/tickets/${ticketId}/order`, input);
};
