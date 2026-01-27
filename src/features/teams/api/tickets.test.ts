import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import { fetchTeamTickets } from "./tickets";

vi.mock("@/lib/client", () => ({
	client: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

const mockClient = getMockClient();

const mockTicket = {
	id: "ticket-123",
	title: "Test Ticket",
	description: "Test description",
	status: "open",
	dueDate: null,
	assignees: [],
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

	describe("fetchTeamTickets", () => {
		it("should fetch team tickets", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockTicket] }),
			});

			const result = await fetchTeamTickets("team-123");

			expect(mockClient.get).toHaveBeenCalledWith("/teams/team-123/tickets");
			expect(result).toEqual([mockTicket]);
		});

		it("should return empty array when no tickets", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [] }),
			});

			const result = await fetchTeamTickets("team-123");

			expect(result).toEqual([]);
		});
	});
});
