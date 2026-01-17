import { z } from "zod";

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
});
const reviewerSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

const ticketSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	status: ticketStatusSchema,
	assignees: z.array(assigneeSchema),
	reviewers: z.array(reviewerSchema),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const ticketsSchema = z.array(ticketSchema);
