import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import { activitiesSchema, activitySchema } from "../types/schemas";
import { fetchTicketActivities } from "./activities";

const BASE_URL = "http://localhost:8000/api";

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
	describe("schemas", () => {
		describe("activitySchema", () => {
			it("validates a created activity", () => {
				expect(() => activitySchema.parse(mockActivity)).not.toThrow();
			});

			it("validates a status change activity", () => {
				expect(() =>
					activitySchema.parse(mockStatusChangeActivity),
				).not.toThrow();
			});

			it("allows a null avatarUrl", () => {
				const activity = {
					...mockActivity,
					user: { ...mockActivity.user, avatarUrl: null },
				};
				expect(() => activitySchema.parse(activity)).not.toThrow();
			});

			it("rejects an invalid type", () => {
				const activity = { ...mockActivity, type: "invalid" };
				expect(() => activitySchema.parse(activity)).toThrow();
			});
		});

		describe("activitiesSchema", () => {
			it("validates an array of activities", () => {
				expect(() =>
					activitiesSchema.parse([mockActivity, mockStatusChangeActivity]),
				).not.toThrow();
			});

			it("allows an empty array", () => {
				expect(() => activitiesSchema.parse([])).not.toThrow();
			});
		});
	});

	describe("fetchTicketActivities", () => {
		it("fetches and parses activities", async () => {
			const result = await fetchTicketActivities("ticket-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});

		it("returns an empty array when there are no activities", async () => {
			server.use(
				http.get(`${BASE_URL}/tickets/:ticketId/activities`, () => {
					return HttpResponse.json({ data: [] });
				}),
			);

			const result = await fetchTicketActivities("ticket-123");

			expect(result).toEqual([]);
		});
	});
});
