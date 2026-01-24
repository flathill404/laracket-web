import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { teamSchema } from "../types/schemas";
import {
	addTeamMember,
	deleteTeam,
	fetchTeam,
	fetchTeamMembers,
	fetchTeams,
	fetchTeamTickets,
	removeTeamMember,
	updateTeam,
	updateTeamMember,
} from "./teams";

// Mock the client module
vi.mock("@/lib/client", () => ({
	client: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

import { client } from "@/lib/client";

const mockClient = client as unknown as {
	get: ReturnType<typeof vi.fn>;
	post: ReturnType<typeof vi.fn>;
	put: ReturnType<typeof vi.fn>;
	patch: ReturnType<typeof vi.fn>;
	delete: ReturnType<typeof vi.fn>;
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

	describe("updateTeam", () => {
		it("should update team", async () => {
			const updateData = { name: "updated-name", displayName: "Updated Name" };
			const updated = { ...mockTeam, ...updateData };
			mockClient.put.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: updated }),
			});

			const result = await updateTeam("team-123", updateData);

			expect(mockClient.put).toHaveBeenCalledWith(
				"/teams/team-123",
				updateData,
			);
			expect(result).toEqual(updated);
		});
	});

	describe("deleteTeam", () => {
		it("should delete team", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await deleteTeam("team-123");

			expect(mockClient.delete).toHaveBeenCalledWith("/teams/team-123");
		});
	});

	describe("members", () => {
		const mockMember = {
			id: "user-123",
			name: "john",
			displayName: "John Doe",
			role: "member",
		};

		describe("fetchTeamMembers", () => {
			it("should fetch members", async () => {
				mockClient.get.mockResolvedValueOnce({
					json: () => Promise.resolve({ data: [mockMember] }),
				});

				const result = await fetchTeamMembers("team-123");

				expect(mockClient.get).toHaveBeenCalledWith("/teams/team-123/members");
				expect(result).toEqual([mockMember]);
			});
		});

		describe("addTeamMember", () => {
			it("should add member", async () => {
				mockClient.post.mockResolvedValueOnce({
					json: () => Promise.resolve({ data: mockMember }),
				});

				const result = await addTeamMember("team-123", { userId: "user-123" });

				expect(mockClient.post).toHaveBeenCalledWith(
					"/teams/team-123/members",
					{ userId: "user-123" },
				);
				expect(result).toEqual(mockMember);
			});
		});

		describe("updateTeamMember", () => {
			it("should update member", async () => {
				const updatedMember = { ...mockMember, role: "leader" };
				mockClient.patch.mockResolvedValueOnce({
					json: () => Promise.resolve({ data: updatedMember }),
				});

				const result = await updateTeamMember("team-123", "user-123", {
					role: "leader",
				});

				expect(mockClient.patch).toHaveBeenCalledWith(
					"/teams/team-123/members/user-123",
					{ role: "leader" },
				);
				expect(result).toEqual(updatedMember);
			});
		});

		describe("removeTeamMember", () => {
			it("should remove member", async () => {
				mockClient.delete.mockResolvedValueOnce({});

				await removeTeamMember("team-123", "user-123");

				expect(mockClient.delete).toHaveBeenCalledWith(
					"/teams/team-123/members/user-123",
				);
			});
		});
	});
});
