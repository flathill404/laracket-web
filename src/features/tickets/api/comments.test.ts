import { describe, expect, it } from "vitest";

import { commentSchema, commentsSchema } from "../types/schemas";
import { createTicketComment, fetchTicketComments } from "./comments";

const mockComment = {
	id: "comment-123",
	content: "Test comment",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
	user: {
		id: "user-123",
		name: "john",
		displayName: "John Doe",
		avatarUrl: null,
	},
};

describe("comments API", () => {
	describe("schemas", () => {
		describe("commentSchema", () => {
			it("validates a valid comment", () => {
				expect(() => commentSchema.parse(mockComment)).not.toThrow();
			});
		});

		describe("commentsSchema", () => {
			it("validates an array of comments", () => {
				expect(() => commentsSchema.parse([mockComment])).not.toThrow();
			});
		});
	});

	describe("fetchTicketComments", () => {
		it("fetches ticket comments", async () => {
			const result = await fetchTicketComments("ticket-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
			expect(result[0].id).toBeDefined();
		});
	});

	describe("createTicketComment", () => {
		it("creates a ticket comment", async () => {
			const data = { content: "Test comment" };
			const result = await createTicketComment("ticket-123", data);

			expect(result.content).toBe("Test comment");
			expect(result.user).toBeDefined();
		});
	});
});
