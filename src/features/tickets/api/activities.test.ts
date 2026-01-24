import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { activitiesSchema, activitySchema } from "../types/schemas";
import { fetchTicketActivities } from "./activities";

// Mock the client module
vi.mock("@/lib/client", () => ({
	client: {
		get: vi.fn(),
	},
}));

import { client } from "@/lib/client";

const mockClient = client as unknown as {
	get: ReturnType<typeof vi.fn>;
};

const mockActivity = {
	id: 1,
	type: "created",
	payload: null,
	createdAt: "2024-01-01T00:00:00Z",
	user: {
		id: "user-123",
		name: "john",
		displayName: "John Doe",
		avatarUrl: "https://example.com/avatar.jpg",
	},
};

const mockStatusChangeActivity = {
	id: 2,
	type: "updated",
	payload: {
		status: {
			from: "open",
			to: "in_progress",
		},
	},
	createdAt: "2024-01-02T00:00:00Z",
	user: {
		id: "user-123",
		name: "john",
		displayName: "John Doe",
		avatarUrl: null,
	},
};

describe("activities API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("schemas", () => {
		describe("activitySchema", () => {
			it("should validate a created activity", () => {
				expect(() => activitySchema.parse(mockActivity)).not.toThrow();
			});

			it("should validate a status change activity", () => {
				expect(() =>
					activitySchema.parse(mockStatusChangeActivity),
				).not.toThrow();
			});

			it("should allow null avatarUrl", () => {
				const activity = {
					...mockActivity,
					user: { ...mockActivity.user, avatarUrl: null },
				};
				expect(() => activitySchema.parse(activity)).not.toThrow();
			});

			it("should reject invalid type", () => {
				const activity = { ...mockActivity, type: "invalid" };
				expect(() => activitySchema.parse(activity)).toThrow();
			});
		});

		describe("activitiesSchema", () => {
			it("should validate array of activities", () => {
				expect(() =>
					activitiesSchema.parse([mockActivity, mockStatusChangeActivity]),
				).not.toThrow();
			});

			it("should allow empty array", () => {
				expect(() => activitiesSchema.parse([])).not.toThrow();
			});
		});
	});

	describe("fetchTicketActivities", () => {
		it("should fetch and parse activities", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockActivity] }),
			});

			const result = await fetchTicketActivities("ticket-123");

			expect(mockClient.get).toHaveBeenCalledWith(
				"/tickets/ticket-123/activities",
			);
			expect(result).toEqual([mockActivity]);
		});

		it("should return empty array when no activities", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [] }),
			});

			const result = await fetchTicketActivities("ticket-123");

			expect(result).toEqual([]);
		});
	});
});
