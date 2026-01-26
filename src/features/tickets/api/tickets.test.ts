import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
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

vi.mock("@/lib/client");

const mockClient = getMockClient();

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
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("schemas", () => {
		describe("ticketStatusSchema", () => {
			it("should validate all status values", () => {
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

			it("should reject invalid status", () => {
				expect(() => ticketStatusSchema.parse("invalid")).toThrow();
			});
		});

		describe("ticketSchema", () => {
			it("should validate a valid ticket", () => {
				expect(() => ticketSchema.parse(mockTicket)).not.toThrow();
			});

			it("should allow null dueDate", () => {
				const ticket = { ...mockTicket, dueDate: null };
				expect(() => ticketSchema.parse(ticket)).not.toThrow();
			});

			it("should reject invalid status", () => {
				const ticket = { ...mockTicket, status: "invalid" };
				expect(() => ticketSchema.parse(ticket)).toThrow();
			});
		});

		describe("ticketsSchema", () => {
			it("should validate array of tickets", () => {
				expect(() => ticketsSchema.parse([mockTicket])).not.toThrow();
			});

			it("should allow empty array", () => {
				expect(() => ticketsSchema.parse([])).not.toThrow();
			});
		});

		describe("paginatedTicketsSchema", () => {
			it("should validate paginated response", () => {
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
		it("should fetch and parse ticket data", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockTicket }),
			});

			const result = await fetchTicket("ticket-123");

			expect(mockClient.get).toHaveBeenCalledWith("/tickets/ticket-123");
			expect(result).toEqual(mockTicket);
		});
	});

	describe("fetchUserTickets", () => {
		it("should fetch user tickets", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockTicket] }),
			});

			const result = await fetchUserTickets("user-123");

			expect(mockClient.get).toHaveBeenCalledWith("/users/user-123/tickets");
			expect(result).toEqual([mockTicket]);
		});
	});

	describe("createTicket", () => {
		it("should create a ticket", async () => {
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockTicket }),
			});

			const data = {
				title: "New Ticket",
				description: "Description",
				status: "open" as const,
			};

			const result = await createTicket(data);

			expect(mockClient.post).toHaveBeenCalledWith("/tickets", data);
			expect(result).toEqual(mockTicket);
		});
	});

	describe("updateTicket", () => {
		it("should update a ticket", async () => {
			const updatedTicket = { ...mockTicket, title: "Updated Title" };
			mockClient.put.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: updatedTicket }),
			});

			const result = await updateTicket("ticket-123", {
				title: "Updated Title",
			});

			expect(mockClient.put).toHaveBeenCalledWith("/tickets/ticket-123", {
				title: "Updated Title",
			});
			expect(result.title).toBe("Updated Title");
		});
	});

	describe("updateTicketStatus", () => {
		it("should update ticket status", async () => {
			mockClient.patch.mockResolvedValueOnce({});

			await updateTicketStatus("ticket-123", { status: "in_progress" });

			expect(mockClient.patch).toHaveBeenCalledWith(
				"/tickets/ticket-123/status",
				{
					status: "in_progress",
				},
			);
		});
	});

	describe("assignee management", () => {
		it("should add ticket assignee", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await addTicketAssignee("ticket-123", { userId: "user-456" });

			expect(mockClient.post).toHaveBeenCalledWith(
				"/tickets/ticket-123/assignees",
				{
					userId: "user-456",
				},
			);
		});

		it("should remove ticket assignee", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await removeTicketAssignee("ticket-123", "user-456");

			expect(mockClient.delete).toHaveBeenCalledWith(
				"/tickets/ticket-123/assignees/user-456",
			);
		});
	});

	describe("reviewer management", () => {
		it("should add ticket reviewer", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await addTicketReviewer("ticket-123", { userId: "user-789" });

			expect(mockClient.post).toHaveBeenCalledWith(
				"/tickets/ticket-123/reviewers",
				{
					userId: "user-789",
				},
			);
		});

		it("should remove ticket reviewer", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await removeTicketReviewer("ticket-123", "user-789");

			expect(mockClient.delete).toHaveBeenCalledWith(
				"/tickets/ticket-123/reviewers/user-789",
			);
		});
	});

	describe("deleteTicket", () => {
		it("should delete a ticket", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await deleteTicket("ticket-123");

			expect(mockClient.delete).toHaveBeenCalledWith("/tickets/ticket-123");
		});
	});

	describe("searchTickets", () => {
		it("should search tickets", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () =>
					Promise.resolve({
						data: [mockTicket],
						links: {
							first: "http://api/tickets?cursor=abc",
							last: null,
							prev: null,
							next: null,
						},
						meta: {
							path: "http://api/tickets",
							perPage: 10,
							nextCursor: null,
							prevCursor: null,
						},
					}),
			});

			const result = await searchTickets("test");

			expect(mockClient.get).toHaveBeenCalledWith("/tickets/search?q=test");
			expect(result.data).toEqual([mockTicket]);
		});
	});

	describe("updateTicketOrder", () => {
		it("should update ticket order", async () => {
			mockClient.patch.mockResolvedValueOnce({});

			await updateTicketOrder("ticket-123", { order: 10 });

			expect(mockClient.patch).toHaveBeenCalledWith(
				"/tickets/ticket-123/order",
				{ order: 10 },
			);
		});
	});
});
