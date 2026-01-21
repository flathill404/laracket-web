import { z } from "zod";
import { client } from "@/lib/client";

enum TicketStatus {
	Open = "open",
	InProgress = "in_progress",
	InReview = "in_review",
	Resolved = "resolved",
	Closed = "closed",
}

export const ticketStatusSchema = z.enum([
	TicketStatus.Open,
	TicketStatus.InProgress,
	TicketStatus.InReview,
	TicketStatus.Resolved,
	TicketStatus.Closed,
]);

export type TicketStatusType = z.infer<typeof ticketStatusSchema>;

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
	avatarUrl: z.string().nullish(),
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

export const updateTicket = async (
	ticketId: string,
	data: Partial<z.infer<typeof ticketSchema>>,
) => {
	const response = await client.put(`/tickets/${ticketId}`, data);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const updateTicketStatus = async (
	ticketId: string,
	status: z.infer<typeof ticketStatusSchema>,
) => {
	const response = await client.patch(`/tickets/${ticketId}/status`, {
		status,
	});
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const addTicketAssignee = async (ticketId: string, userId: string) => {
	const response = await client.post(`/tickets/${ticketId}/assignees`, {
		userId,
	});
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const removeTicketAssignee = async (
	ticketId: string,
	userId: string,
) => {
	const response = await client.delete(
		`/tickets/${ticketId}/assignees/${userId}`,
	);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const addTicketReviewer = async (ticketId: string, userId: string) => {
	const response = await client.post(`/tickets/${ticketId}/reviewers`, {
		userId,
	});
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export const removeTicketReviewer = async (
	ticketId: string,
	userId: string,
) => {
	const response = await client.delete(
		`/tickets/${ticketId}/reviewers/${userId}`,
	);
	const json = await response.json();
	return ticketSchema.parse(json.data);
};

export { assigneeSchema, reviewerSchema };
export type Assignee = z.infer<typeof assigneeSchema>;
export type Reviewer = z.infer<typeof reviewerSchema>;
