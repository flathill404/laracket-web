import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import {
	paginatedTicketsSchema,
	ticketSchema,
	ticketStatusSchema,
	ticketsSchema,
} from "../types/schemas";
import {
	addTicketAssignee,
	addTicketReviewer,
	createTicket,
	deleteTicket,
	fetchTicket,
	fetchUserTickets,
	removeTicketAssignee,
	removeTicketReviewer,
	searchTickets,
	updateTicket,
	updateTicketOrder,
	updateTicketStatus,
} from "./tickets";

const BASE_URL = "http://localhost:8000/api";

const mockTicket = {
	id: "ticket-123",
	title: "Test Ticket",
	description: "Test description",
	status: "open",
	dueDate: "2024-12-31T23:59:59Z",
	assignees: [
		{
			id: "user-1",
			name: "john",
			displayName: "John Doe",
			avatarUrl: null,
		},
	],
	reviewers: [],
	projectId: "project-123",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

describe("tickets API", () => {
	describe("schemas", () => {
		describe("ticketStatusSchema", () => {
			it("validates all status values", () => {
				for (const status of [
					"open",
					"in_progress",
					"in_review",
					"resolved",
					"closed",
				]) {
					expect(() => ticketStatusSchema.parse(status)).not.toThrow();
				}
			});

			it("rejects an invalid status", () => {
				expect(() => ticketStatusSchema.parse("invalid")).toThrow();
			});
		});

		describe("ticketSchema", () => {
			it("validates a valid ticket", () => {
				expect(() => ticketSchema.parse(mockTicket)).not.toThrow();
			});

			it("allows a null dueDate", () => {
				const ticket = { ...mockTicket, dueDate: null };
				expect(() => ticketSchema.parse(ticket)).not.toThrow();
			});

			it("rejects an invalid status", () => {
				const ticket = { ...mockTicket, status: "invalid" };
				expect(() => ticketSchema.parse(ticket)).toThrow();
			});
		});

		describe("ticketsSchema", () => {
			it("validates an array of tickets", () => {
				expect(() => ticketsSchema.parse([mockTicket])).not.toThrow();
			});

			it("allows an empty array", () => {
				expect(() => ticketsSchema.parse([])).not.toThrow();
			});
		});

		describe("paginatedTicketsSchema", () => {
			it("validates a paginated response", () => {
				const paginatedResponse = {
					data: [mockTicket],
					links: {
						first: "http://api/tickets?cursor=abc",
						last: null,
						prev: null,
						next: "http://api/tickets?cursor=def",
					},
					meta: {
						path: "http://api/tickets",
						perPage: 10,
						nextCursor: "def",
						prevCursor: null,
					},
				};
				expect(() =>
					paginatedTicketsSchema.parse(paginatedResponse),
				).not.toThrow();
			});
		});
	});

	describe("fetchTicket", () => {
		it("fetches and parses ticket data", async () => {
			const result = await fetchTicket("ticket-123");

			expect(result.id).toBe("ticket-123");
			expect(result.title).toBe("Test Ticket");
		});
	});

	describe("fetchUserTickets", () => {
		it("fetches user tickets", async () => {
			const result = await fetchUserTickets("user-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("createTicket", () => {
		it("creates a ticket", async () => {
			const data = {
				title: "New Ticket",
				description: "Description",
				status: "open" as const,
			};

			const result = await createTicket(data);

			expect(result.title).toBe("New Ticket");
		});
	});

	describe("updateTicket", () => {
		it("updates a ticket", async () => {
			server.use(
				http.put(`${BASE_URL}/tickets/:ticketId`, async ({ request }) => {
					const body = (await request.json()) as { title: string };
					return HttpResponse.json({
						data: { ...mockTicket, title: body.title },
					});
				}),
			);

			const result = await updateTicket("ticket-123", {
				title: "Updated Title",
			});

			expect(result.title).toBe("Updated Title");
		});
	});

	describe("updateTicketStatus", () => {
		it("updates the ticket status", async () => {
			await expect(
				updateTicketStatus("ticket-123", { status: "in_progress" }),
			).resolves.not.toThrow();
		});
	});

	describe("assignee management", () => {
		it("adds a ticket assignee", async () => {
			await expect(
				addTicketAssignee("ticket-123", { userId: "user-456" }),
			).resolves.not.toThrow();
		});

		it("removes a ticket assignee", async () => {
			await expect(
				removeTicketAssignee("ticket-123", "user-456"),
			).resolves.not.toThrow();
		});
	});

	describe("reviewer management", () => {
		it("adds a ticket reviewer", async () => {
			await expect(
				addTicketReviewer("ticket-123", { userId: "user-789" }),
			).resolves.not.toThrow();
		});

		it("removes a ticket reviewer", async () => {
			await expect(
				removeTicketReviewer("ticket-123", "user-789"),
			).resolves.not.toThrow();
		});
	});

	describe("deleteTicket", () => {
		it("deletes a ticket", async () => {
			await expect(deleteTicket("ticket-123")).resolves.not.toThrow();
		});
	});

	describe("searchTickets", () => {
		it("searches tickets", async () => {
			const result = await searchTickets("test");

			expect(result.data).toBeInstanceOf(Array);
			expect(result.meta).toBeDefined();
			expect(result.links).toBeDefined();
		});
	});

	describe("updateTicketOrder", () => {
		it("updates the ticket order", async () => {
			await expect(
				updateTicketOrder("ticket-123", { order: 10 }),
			).resolves.not.toThrow();
		});
	});
});
