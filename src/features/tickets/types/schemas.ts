import { z } from "zod";
import { TICKET_STATUS_VALUES } from "../utils/constants";

// Ticket Status Schema
export const ticketStatusSchema = z.enum(TICKET_STATUS_VALUES);

// Ticket User Schema
export const ticketUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullish(),
});

// Ticket Schema
export const ticketSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	status: ticketStatusSchema,
	dueDate: z.iso.datetime().nullish(),
	assignees: z.array(ticketUserSchema),
	reviewers: z.array(ticketUserSchema),
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

// Schema for Laravel simple pagination response (search)
export const simplePaginatedTicketsSchema = z.object({
	data: z.array(ticketSchema),
	links: z.object({
		first: z.string().nullable(),
		last: z.string().nullable(), // SimplePaginate often has null last
		prev: z.string().nullable(),
		next: z.string().nullable(),
	}),
	meta: z.object({
		currentPage: z.number(),
		from: z.number().nullable(),
		path: z.string(),
		perPage: z.number(),
		to: z.number().nullable(),
	}),
});

// Activity Schemas
const activityUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullish(),
});

const statusChangePayloadSchema = z.object({
	status: z.object({
		from: ticketStatusSchema,
		to: ticketStatusSchema,
	}),
});

const activityPayloadSchema = z
	.union([statusChangePayloadSchema, z.record(z.string(), z.unknown())])
	.nullish();

export const activitySchema = z.object({
	id: z.number(),
	type: z.enum(["created", "updated"]),
	payload: activityPayloadSchema,
	createdAt: z.iso.datetime(),
	user: activityUserSchema,
});

export const activitiesSchema = z.array(activitySchema);

// Comment Schemas
export const commentSchema = z.object({
	id: z.string(),
	content: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	user: ticketUserSchema,
});

export const commentsSchema = z.array(commentSchema);

/* Inputs */

export const createTicketInputSchema = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	status: ticketStatusSchema.optional(),
	priority: z.string().optional(),
	assigneeIds: z.array(z.string()).optional(),
	reviewerIds: z.array(z.string()).optional(),
	dueDate: z.string().nullish(),
});

export const updateTicketInputSchema = createTicketInputSchema.partial();

export const updateTicketStatusInputSchema = z.object({
	status: ticketStatusSchema,
});

export const ticketAssigneeInputSchema = z.object({
	userId: z.string(),
});

export const ticketReviewerInputSchema = z.object({
	userId: z.string(),
});

export const ticketOrderInputSchema = z.object({
	order: z.number(),
});
