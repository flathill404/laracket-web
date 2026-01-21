import { z } from "zod";
import { client } from "@/lib/client";

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
	dueDate: z.iso.datetime().nullish(),
	assignees: z.array(assigneeSchema),
	reviewers: z.array(reviewerSchema),
	projectId: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const ticketsSchema = z.array(ticketSchema);

// Schema for Laravel cursor pagination response
export const paginatedTicketsSchema = z.object({
	data: z.array(ticketSchema),
	links: z.object({
		first: z.string().nullable(),
		last: z.string().nullable(),
		prev: z.string().nullable(),
		next: z.string().nullable(),
	}),
	meta: z.object({
		path: z.string(),
		perPage: z.number(),
		nextCursor: z.string().nullable(),
		prevCursor: z.string().nullable(),
	}),
});

export type PaginatedTicketsResponse = z.infer<typeof paginatedTicketsSchema>;

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
