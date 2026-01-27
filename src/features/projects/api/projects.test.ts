import { getMockClient } from "@/test/utils";
import { projectSchema } from "../types/schemas";
import {
	createProject,
	deleteProject,
	fetchProject,
	fetchProjects,
	updateProject,
} from "./projects";

vi.mock("@/lib/client");

const mockClient = getMockClient();

const mockProject = {
	id: "project-123",
	name: "test-project",
	displayName: "Test Project",
	description: "A test project",
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

	describe("schemas", () => {
		describe("projectSchema", () => {
			it("should validate a valid project", () => {
				expect(() => projectSchema.parse(mockProject)).not.toThrow();
			});

			it("should reject missing required fields", () => {
				const invalid = { id: "123" };
				expect(() => projectSchema.parse(invalid)).toThrow();
			});
		});
	});

	describe("fetchProjects", () => {
		it("should fetch user projects", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockProject] }),
			});

			const result = await fetchProjects("user-123");

			expect(mockClient.get).toHaveBeenCalledWith("/users/user-123/projects");
			expect(result).toEqual([mockProject]);
		});
	});

	describe("fetchProject", () => {
		it("should fetch single project", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockProject }),
			});

			const result = await fetchProject("project-123");

			expect(mockClient.get).toHaveBeenCalledWith("/projects/project-123");
			expect(result).toEqual(mockProject);
		});
	});

	describe("createProject", () => {
		it("should create project", async () => {
			const projectData = {
				name: "test-project",
				displayName: "Test Project",
				description: "A test project",
			};
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockProject }),
			});

			const result = await createProject(projectData);

			expect(mockClient.post).toHaveBeenCalledWith("/projects", projectData);
			expect(result).toEqual(mockProject);
		});
	});

	describe("updateProject", () => {
		it("should update project", async () => {
			const updateData = { name: "updated-name", description: "updated desc" };
			const updated = { ...mockProject, ...updateData };
			mockClient.put.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: updated }),
			});

			const result = await updateProject("project-123", updateData);

			expect(mockClient.put).toHaveBeenCalledWith(
				"/projects/project-123",
				updateData,
			);
			expect(result.name).toBe("updated-name");
			expect(result.description).toBe("updated desc");
		});
	});

	describe("deleteProject", () => {
		it("should delete project", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await deleteProject("project-123");

			expect(mockClient.delete).toHaveBeenCalledWith("/projects/project-123");
		});
	});
});
