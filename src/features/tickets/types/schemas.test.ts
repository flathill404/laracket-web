import { describe, expect, it } from "vitest";
import {
	activitiesSchema,
	activitySchema,
	commentSchema,
	commentsSchema,
	createTicketInputSchema,
	paginatedTicketsSchema,
	ticketAssigneeInputSchema,
	ticketOrderInputSchema,
	ticketReviewerInputSchema,
	ticketSchema,
	ticketStatusSchema,
	ticketsSchema,
	ticketUserSchema,
	updateTicketInputSchema,
	updateTicketStatusInputSchema,
} from "./schemas";

describe("ticket schemas", () => {
	describe("ticketStatusSchema", () => {
		it("validates valid status values", () => {
			const validStatuses = [
				"open",
				"in_progress",
				"in_review",
				"resolved",
				"closed",
			];
			for (const status of validStatuses) {
				expect(ticketStatusSchema.parse(status)).toBe(status);
			}
		});

		it("throws on invalid status", () => {
			expect(() => ticketStatusSchema.parse("invalid")).toThrow();
		});
	});

	describe("ticketUserSchema", () => {
		it("validates valid user", () => {
			const valid = {
				id: "u1",
				name: "user1",
				displayName: "User 1",
			};
			expect(ticketUserSchema.parse(valid)).toEqual(valid);
		});

		it("validates user with null avatarUrl", () => {
			const valid = {
				id: "u1",
				name: "user1",
				displayName: "User 1",
				avatarUrl: null,
			};
			expect(ticketUserSchema.parse(valid)).toEqual(valid);
		});

		it("validates user with avatarUrl", () => {
			const valid = {
				id: "u1",
				name: "user1",
				displayName: "User 1",
				avatarUrl: "http://example.com/avatar.jpg",
			};
			expect(ticketUserSchema.parse(valid)).toEqual(valid);
		});
	});

	describe("ticketSchema", () => {
		const validTicket = {
			id: "t1",
			title: "Test Ticket",
			description: "Description",
			status: "open" as const,
			dueDate: null,
			assignees: [],
			reviewers: [],
			projectId: "p1",
			createdAt: "2024-01-28T10:00:00Z",
			updatedAt: "2024-01-28T10:00:00Z",
		};

		it("validates valid ticket", () => {
			const result = ticketSchema.safeParse(validTicket);
			expect(result.success).toBe(true);
		});

		it("validates ticket with optional fields", () => {
			const result = ticketSchema.safeParse({
				...validTicket,
				dueDate: "2024-12-31T23:59:59Z",
				displayOrder: 1,
				project: {
					id: "p1",
					name: "project1",
					displayName: "Project 1",
				},
			});
			expect(result.success).toBe(true);
		});

		it("validates ticket with assignees and reviewers", () => {
			const result = ticketSchema.safeParse({
				...validTicket,
				assignees: [
					{ id: "u1", name: "user1", displayName: "User 1", avatarUrl: null },
				],
				reviewers: [
					{ id: "u2", name: "user2", displayName: "User 2", avatarUrl: null },
				],
			});
			expect(result.success).toBe(true);
		});

		it("throws on missing required fields", () => {
			const result = ticketSchema.safeParse({
				id: "t1",
				title: "Test",
			});
			expect(result.success).toBe(false);
		});

		it("throws on invalid status", () => {
			const result = ticketSchema.safeParse({
				...validTicket,
				status: "invalid",
			});
			expect(result.success).toBe(false);
		});

		it("throws on invalid date format", () => {
			const result = ticketSchema.safeParse({
				...validTicket,
				createdAt: "invalid-date",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("ticketsSchema", () => {
		it("validates array of tickets", () => {
			const valid = [
				{
					id: "t1",
					title: "Ticket 1",
					description: "Desc 1",
					status: "open" as const,
					dueDate: null,
					assignees: [],
					reviewers: [],
					projectId: "p1",
					createdAt: "2024-01-28T10:00:00Z",
					updatedAt: "2024-01-28T10:00:00Z",
				},
			];
			expect(ticketsSchema.parse(valid)).toEqual(valid);
		});

		it("validates empty array", () => {
			expect(ticketsSchema.parse([])).toEqual([]);
		});
	});

	describe("paginatedTicketsSchema", () => {
		it("validates paginated response", () => {
			const valid = {
				data: [],
				links: {
					first: null,
					last: null,
					prev: null,
					next: null,
				},
				meta: {
					path: "/tickets",
					perPage: 15,
					nextCursor: null,
					prevCursor: null,
				},
			};
			expect(paginatedTicketsSchema.parse(valid)).toEqual(valid);
		});

		it("validates paginated response with data and cursors", () => {
			const valid = {
				data: [
					{
						id: "t1",
						title: "Ticket 1",
						description: "Desc",
						status: "open" as const,
						dueDate: null,
						assignees: [],
						reviewers: [],
						projectId: "p1",
						createdAt: "2024-01-28T10:00:00Z",
						updatedAt: "2024-01-28T10:00:00Z",
					},
				],
				links: {
					first: "http://example.com?cursor=first",
					last: "http://example.com?cursor=last",
					prev: "http://example.com?cursor=prev",
					next: "http://example.com?cursor=next",
				},
				meta: {
					path: "/tickets",
					perPage: 15,
					nextCursor: "next-cursor",
					prevCursor: "prev-cursor",
				},
			};
			const result = paginatedTicketsSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});
	});

	describe("activitySchema", () => {
		it("validates activity with created type", () => {
			const valid = {
				id: 1,
				type: "created" as const,
				payload: null,
				createdAt: "2024-01-28T10:00:00Z",
				user: {
					id: "u1",
					name: "user1",
					displayName: "User 1",
					avatarUrl: null,
				},
			};
			expect(activitySchema.parse(valid)).toEqual(valid);
		});

		it("validates activity with status change payload", () => {
			const valid = {
				id: 1,
				type: "updated" as const,
				payload: {
					status: {
						from: "open" as const,
						to: "in_progress" as const,
					},
				},
				createdAt: "2024-01-28T10:00:00Z",
				user: {
					id: "u1",
					name: "user1",
					displayName: "User 1",
					avatarUrl: null,
				},
			};
			expect(activitySchema.parse(valid)).toEqual(valid);
		});

		it("validates activity with generic payload", () => {
			const valid = {
				id: 1,
				type: "updated" as const,
				payload: { customField: "value" },
				createdAt: "2024-01-28T10:00:00Z",
				user: {
					id: "u1",
					name: "user1",
					displayName: "User 1",
					avatarUrl: null,
				},
			};
			const result = activitySchema.safeParse(valid);
			expect(result.success).toBe(true);
		});
	});

	describe("activitiesSchema", () => {
		it("validates array of activities", () => {
			const valid = [
				{
					id: 1,
					type: "created" as const,
					payload: null,
					createdAt: "2024-01-28T10:00:00Z",
					user: {
						id: "u1",
						name: "user1",
						displayName: "User 1",
						avatarUrl: null,
					},
				},
			];
			expect(activitiesSchema.parse(valid)).toEqual(valid);
		});

		it("validates empty array", () => {
			expect(activitiesSchema.parse([])).toEqual([]);
		});
	});

	describe("commentSchema", () => {
		it("validates valid comment", () => {
			const valid = {
				id: "c1",
				content: "Test comment",
				createdAt: "2024-01-28T10:00:00Z",
				updatedAt: "2024-01-28T10:00:00Z",
				user: {
					id: "u1",
					name: "user1",
					displayName: "User 1",
					avatarUrl: null,
				},
			};
			expect(commentSchema.parse(valid)).toEqual(valid);
		});

		it("throws on missing fields", () => {
			expect(() =>
				commentSchema.parse({
					id: "c1",
					content: "Test",
				}),
			).toThrow();
		});
	});

	describe("commentsSchema", () => {
		it("validates array of comments", () => {
			const valid = [
				{
					id: "c1",
					content: "Test",
					createdAt: "2024-01-28T10:00:00Z",
					updatedAt: "2024-01-28T10:00:00Z",
					user: {
						id: "u1",
						name: "user1",
						displayName: "User 1",
						avatarUrl: null,
					},
				},
			];
			expect(commentsSchema.parse(valid)).toEqual(valid);
		});

		it("validates empty array", () => {
			expect(commentsSchema.parse([])).toEqual([]);
		});
	});

	describe("createTicketInputSchema", () => {
		it("validates valid input", () => {
			const valid = { title: "New Ticket" };
			expect(createTicketInputSchema.parse(valid)).toEqual(valid);
		});

		it("validates input with all fields", () => {
			const valid = {
				title: "New Ticket",
				description: "Description",
				status: "open" as const,
				priority: "high",
				assigneeIds: ["u1", "u2"],
				reviewerIds: ["u3"],
				dueDate: "2024-12-31T23:59:59Z",
			};
			expect(createTicketInputSchema.parse(valid)).toEqual(valid);
		});

		it("throws on empty title", () => {
			expect(() => createTicketInputSchema.parse({ title: "" })).toThrow();
		});

		it("throws on missing title", () => {
			expect(() => createTicketInputSchema.parse({})).toThrow();
		});

		it("throws on invalid status", () => {
			const result = createTicketInputSchema.safeParse({
				title: "Test",
				status: "invalid",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("updateTicketInputSchema", () => {
		it("validates partial input", () => {
			const valid = { title: "Updated Title" };
			expect(updateTicketInputSchema.parse(valid)).toEqual(valid);
		});

		it("validates empty object", () => {
			expect(updateTicketInputSchema.parse({})).toEqual({});
		});

		it("validates input with multiple fields", () => {
			const valid = {
				title: "Updated",
				description: "New description",
				status: "in_progress" as const,
			};
			expect(updateTicketInputSchema.parse(valid)).toEqual(valid);
		});
	});

	describe("updateTicketStatusInputSchema", () => {
		it("validates valid status", () => {
			const valid = { status: "in_progress" as const };
			expect(updateTicketStatusInputSchema.parse(valid)).toEqual(valid);
		});

		it("throws on invalid status", () => {
			expect(() =>
				updateTicketStatusInputSchema.parse({ status: "invalid" }),
			).toThrow();
		});

		it("throws on missing status", () => {
			expect(() => updateTicketStatusInputSchema.parse({})).toThrow();
		});
	});

	describe("ticketAssigneeInputSchema", () => {
		it("validates valid input", () => {
			const valid = { userId: "u1" };
			expect(ticketAssigneeInputSchema.parse(valid)).toEqual(valid);
		});

		it("throws on missing userId", () => {
			expect(() => ticketAssigneeInputSchema.parse({})).toThrow();
		});
	});

	describe("ticketReviewerInputSchema", () => {
		it("validates valid input", () => {
			const valid = { userId: "u2" };
			expect(ticketReviewerInputSchema.parse(valid)).toEqual(valid);
		});

		it("throws on missing userId", () => {
			expect(() => ticketReviewerInputSchema.parse({})).toThrow();
		});
	});

	describe("ticketOrderInputSchema", () => {
		it("validates valid order", () => {
			const valid = { order: 1 };
			expect(ticketOrderInputSchema.parse(valid)).toEqual(valid);
		});

		it("validates order with zero", () => {
			const valid = { order: 0 };
			expect(ticketOrderInputSchema.parse(valid)).toEqual(valid);
		});

		it("throws on missing order", () => {
			expect(() => ticketOrderInputSchema.parse({})).toThrow();
		});

		it("throws on non-number order", () => {
			expect(() => ticketOrderInputSchema.parse({ order: "1" })).toThrow();
		});
	});
});
