import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import { createOrganizationTeam, fetchOrganizationTeams } from "./teams";

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
	name: "test-team",
	displayName: "Test Team",
};

describe("teams API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fetchOrganizationTeams", () => {
		it("should fetch teams", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockTeam] }),
			});

			const result = await fetchOrganizationTeams("org-123");

			expect(mockClient.get).toHaveBeenCalledWith(
				"/organizations/org-123/teams",
			);
			expect(result).toEqual([mockTeam]);
		});
	});

	describe("createOrganizationTeam", () => {
		it("should create team", async () => {
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockTeam }),
			});

			const data = { name: "test", displayName: "desc" };
			const result = await createOrganizationTeam("org-123", data);

			expect(mockClient.post).toHaveBeenCalledWith(
				"/organizations/org-123/teams",
				data,
			);
			expect(result).toEqual(mockTeam);
		});
	});
});
