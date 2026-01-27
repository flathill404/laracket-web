import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import {
	addOrganizationMember,
	fetchOrganizationMembers,
	removeOrganizationMember,
	updateOrganizationMember,
} from "./members";

vi.mock("@/lib/client");

const mockClient = getMockClient();

const mockMember = {
	id: "user-123",
	name: "john",
	displayName: "John Doe",
	avatarUrl: "https://example.com/avatar.jpg",
	role: "member",
};

describe("members API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fetchOrganizationMembers", () => {
		it("should fetch members", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockMember] }),
			});

			const result = await fetchOrganizationMembers("org-123");

			expect(mockClient.get).toHaveBeenCalledWith(
				"/organizations/org-123/members",
			);
			expect(result).toEqual([mockMember]);
		});
	});

	describe("addOrganizationMember", () => {
		it("should add member", async () => {
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockMember }),
			});

			const result = await addOrganizationMember("org-123", {
				userId: "user-123",
			});

			expect(mockClient.post).toHaveBeenCalledWith(
				"/organizations/org-123/members",
				{ userId: "user-123" },
			);
			expect(result).toEqual(mockMember);
		});
	});

	describe("updateOrganizationMember", () => {
		it("should update member", async () => {
			const updated = { ...mockMember, role: "owner" };
			mockClient.patch.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: updated }),
			});

			const result = await updateOrganizationMember("org-123", "user-123", {
				role: "owner",
			});

			expect(mockClient.patch).toHaveBeenCalledWith(
				"/organizations/org-123/members/user-123",
				{ role: "owner" },
			);
			expect(result).toEqual(updated);
		});
	});

	describe("removeOrganizationMember", () => {
		it("should remove member", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await removeOrganizationMember("org-123", "user-123");

			expect(mockClient.delete).toHaveBeenCalledWith(
				"/organizations/org-123/members/user-123",
			);
		});
	});
});
