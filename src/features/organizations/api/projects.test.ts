import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import {
	createOrganizationProject,
	fetchOrganizationProjects,
} from "./projects";

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

const mockProject = {
	id: "project-123",
	name: "test-project",
	displayName: "Test Project",
	description: "Test description",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

describe("projects API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

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

			const data = {
				name: "test",
				displayName: "Test Project",
				description: "desc",
			};
			const result = await createOrganizationProject("org-123", data);

			expect(mockClient.post).toHaveBeenCalledWith(
				"/organizations/org-123/projects",
				data,
			);
			expect(result).toEqual(mockProject);
		});
	});
});
