import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import { teamSchema } from "../types/schemas";
import { deleteTeam, fetchTeam, fetchTeams, updateTeam } from "./teams";

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

const mockTeam = {
	id: "team-123",
	name: "Test Team",
	displayName: "Test Team",
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
});
