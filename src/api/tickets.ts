import { z } from "zod";
import { client } from "./client";

enum TicketStatus {
	Open = "open",
	InProgress = "in_progress",
	InReview = "in_review",
	Resolved = "resolved",
	Closed = "closed",
}

const ticketStatusSchema = z.enum([
	TicketStatus.Open,
	TicketStatus.InProgress,
	TicketStatus.InReview,
	TicketStatus.Resolved,
	TicketStatus.Closed,
]);

const assigneeSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullish(),
});
const reviewerSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

export const ticketSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	status: ticketStatusSchema,
	assignees: z.array(assigneeSchema),
	reviewers: z.array(reviewerSchema),
	projectId: z.string(), // Added projectId
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const ticketsSchema = z.array(ticketSchema);

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
