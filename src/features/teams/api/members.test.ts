import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import {
	addTeamMember,
	fetchTeamMembers,
	removeTeamMember,
	updateTeamMember,
} from "./members";

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

describe("members API", () => {
	const mockMember = {
		id: "user-123",
		name: "john",
		displayName: "John Doe",
		role: "member",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

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

			expect(mockClient.post).toHaveBeenCalledWith("/teams/team-123/members", {
				userId: "user-123",
			});
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
