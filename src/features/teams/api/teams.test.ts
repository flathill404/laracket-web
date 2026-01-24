import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { teamSchema } from "../types/schemas";
import { fetchTeam, fetchTeams, fetchTeamTickets } from "./teams";

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

const mockTeam = {
	id: "team-123",
	name: "Test Team",
	displayName: "Test Team",
};

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

describe("teams API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("schemas", () => {
		describe("teamSchema", () => {
			it("should validate a valid team", () => {
				expect(() => teamSchema.parse(mockTeam)).not.toThrow();
			});

			it("should reject missing required fields", () => {
				expect(() => teamSchema.parse({ id: "123" })).toThrow();
			});
		});
	});

	describe("fetchTeams", () => {
		it("should fetch user teams", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockTeam] }),
			});

			const result = await fetchTeams("user-123");

			expect(mockClient.get).toHaveBeenCalledWith("/users/user-123/teams");
			expect(result).toEqual([mockTeam]);
		});

		it("should return empty array when no teams", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [] }),
			});

			const result = await fetchTeams("user-123");

			expect(result).toEqual([]);
		});
	});

	describe("fetchTeam", () => {
		it("should fetch single team", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockTeam }),
			});

			const result = await fetchTeam("team-123");

			expect(mockClient.get).toHaveBeenCalledWith("/teams/team-123");
			expect(result).toEqual(mockTeam);
		});
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
