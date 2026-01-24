import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { organizationSchema } from "../types/schemas";
import {
	addOrganizationMember,
	createOrganization,
	createOrganizationProject,
	createOrganizationTeam,
	deleteOrganization,
	fetchOrganization,
	fetchOrganizationMembers,
	fetchOrganizationProjects,
	fetchOrganizations,
	fetchOrganizationTeams,
	removeOrganizationMember,
	updateOrganization,
	updateOrganizationMember,
} from "./organizations";

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

const mockOrganization = {
	id: "org-123",
	name: "test-org",
	displayName: "Test Org",
};

const mockMember = {
	id: "user-123",
	name: "john",
	displayName: "John Doe",
	avatarUrl: "https://example.com/avatar.jpg",
	role: "member",
};

const mockProject = {
	id: "project-123",
	name: "test-project",
	displayName: "Test Project",
	description: "Test description",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

const mockTeam = {
	id: "team-123",
	name: "test-team",
	displayName: "Test Team",
};

describe("organizations API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("schemas", () => {
		describe("organizationSchema", () => {
			it("should validate a valid organization", () => {
				expect(() => organizationSchema.parse(mockOrganization)).not.toThrow();
			});

			it("should reject missing required fields", () => {
				const invalid = { id: "123" };
				expect(() => organizationSchema.parse(invalid)).toThrow();
			});
		});
	});

	describe("fetchOrganizations", () => {
		it("should fetch user organizations", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockOrganization] }),
			});

			const result = await fetchOrganizations();

			expect(mockClient.get).toHaveBeenCalledWith("/organizations");
			expect(result).toEqual([mockOrganization]);
		});
	});

	describe("fetchOrganization", () => {
		it("should fetch single organization", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockOrganization }),
			});

			const result = await fetchOrganization("org-123");

			expect(mockClient.get).toHaveBeenCalledWith("/organizations/org-123");
			expect(result).toEqual(mockOrganization);
		});
	});

	describe("createOrganization", () => {
		it("should create organization", async () => {
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockOrganization }),
			});

			const data = { name: "test", displayName: "Test inAPI" };
			const result = await createOrganization(data);

			expect(mockClient.post).toHaveBeenCalledWith("/organizations", data);
			expect(result).toEqual(mockOrganization);
		});
	});

	describe("updateOrganization", () => {
		it("should update organization", async () => {
			const updated = { ...mockOrganization, name: "updated" };
			mockClient.put.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: updated }),
			});

			const data = { name: "updated", displayName: "Test Org" };
			const result = await updateOrganization("org-123", data);

			expect(mockClient.put).toHaveBeenCalledWith(
				"/organizations/org-123",
				data,
			);
			expect(result).toEqual(updated);
		});
	});

	describe("deleteOrganization", () => {
		it("should delete organization", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await deleteOrganization("org-123");

			expect(mockClient.delete).toHaveBeenCalledWith("/organizations/org-123");
		});
	});

	describe("members", () => {
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

				const result = await addOrganizationMember("org-123", "user-123");

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

	describe("projects", () => {
		describe("fetchOrganizationProjects", () => {
			it("should fetch projects", async () => {
				mockClient.get.mockResolvedValueOnce({
					json: () => Promise.resolve({ data: [mockProject] }),
				});

				const result = await fetchOrganizationProjects("org-123");

				expect(mockClient.get).toHaveBeenCalledWith(
					"/organizations/org-123/projects",
				);
				expect(result).toEqual([mockProject]);
			});
		});

		describe("createOrganizationProject", () => {
			it("should create project", async () => {
				mockClient.post.mockResolvedValueOnce({
					json: () => Promise.resolve({ data: mockProject }),
				});

				const data = { name: "test", description: "desc" };
				const result = await createOrganizationProject("org-123", data);

				expect(mockClient.post).toHaveBeenCalledWith(
					"/organizations/org-123/projects",
					data,
				);
				expect(result).toEqual(mockProject);
			});
		});
	});

	describe("teams", () => {
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
});
