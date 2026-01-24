import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commentSchema, commentsSchema } from "../types/schemas";
import { createTicketComment, fetchTicketComments } from "./comments";

// Mock the client module
vi.mock("@/lib/client", () => ({
	client: {
		get: vi.fn(),
		post: vi.fn(),
	},
}));

import { client } from "@/lib/client";

const mockClient = client as unknown as {
	get: ReturnType<typeof vi.fn>;
	post: ReturnType<typeof vi.fn>;
};

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
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("schemas", () => {
		describe("commentSchema", () => {
			it("should validate a valid comment", () => {
				expect(() => commentSchema.parse(mockComment)).not.toThrow();
			});
		});

		describe("commentsSchema", () => {
			it("should validate array of comments", () => {
				expect(() => commentsSchema.parse([mockComment])).not.toThrow();
			});
		});
	});

	describe("fetchTicketComments", () => {
		it("should fetch ticket comments", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockComment] }),
			});

			const result = await fetchTicketComments("ticket-123");

			expect(mockClient.get).toHaveBeenCalledWith(
				"/tickets/ticket-123/comments",
			);
			expect(result).toEqual([mockComment]);
		});
	});

	describe("createTicketComment", () => {
		it("should create a ticket comment", async () => {
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockComment }),
			});

			const data = { content: "Test comment" };
			const result = await createTicketComment("ticket-123", data);

			expect(mockClient.post).toHaveBeenCalledWith(
				"/tickets/ticket-123/comments",
				data,
			);
			expect(result).toEqual(mockComment);
		});
	});
});
