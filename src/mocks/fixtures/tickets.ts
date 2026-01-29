import type { Activity, Comment, Ticket } from "@/features/tickets/types";
import { createTicketUser } from "./auth";

export const createTicket = (overrides?: Partial<Ticket>): Ticket => ({
	id: "ticket-123",
	title: "Test Ticket",
	description: "Test description",
	status: "open",
	dueDate: "2024-12-31T23:59:59Z",
	assignees: [],
	reviewers: [],
	projectId: "project-123",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
	...overrides,
});

export const createTickets = (count: number): Ticket[] =>
	Array.from({ length: count }, (_, i) =>
		createTicket({ id: `ticket-${i + 1}`, title: `Test Ticket ${i + 1}` }),
	);

export const createPaginatedTickets = (
	tickets: Ticket[],
	options?: { nextCursor?: string | null; prevCursor?: string | null },
) => ({
	data: tickets,
	links: {
		first: "http://localhost:8000/api/tickets?cursor=first",
		last: null,
		prev: options?.prevCursor
			? `http://localhost:8000/api/tickets?cursor=${options.prevCursor}`
			: null,
		next: options?.nextCursor
			? `http://localhost:8000/api/tickets?cursor=${options.nextCursor}`
			: null,
	},
	meta: {
		path: "http://localhost:8000/api/tickets",
		perPage: 10,
		nextCursor: options?.nextCursor ?? null,
		prevCursor: options?.prevCursor ?? null,
	},
});

export const createComment = (overrides?: Partial<Comment>): Comment => ({
	id: "comment-123",
	content: "Test comment content",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
	user: createTicketUser(),
	...overrides,
});

export const createActivity = (overrides?: Partial<Activity>): Activity => ({
	id: 1,
	type: "created",
	payload: null,
	createdAt: "2024-01-01T00:00:00Z",
	user: createTicketUser(),
	...overrides,
});
