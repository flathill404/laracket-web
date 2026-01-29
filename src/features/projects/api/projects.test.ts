import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import { projectSchema } from "../types/schemas";
import {
	createProject,
	deleteProject,
	fetchProject,
	fetchProjects,
	updateProject,
} from "./projects";

const BASE_URL = "http://localhost:8000/api";

const mockProject = {
	id: "project-123",
	name: "test-project",
	displayName: "Test Project",
	description: "A test project",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

describe("projects API", () => {
	describe("schemas", () => {
		describe("projectSchema", () => {
			it("validates a valid project", () => {
				expect(() => projectSchema.parse(mockProject)).not.toThrow();
			});

			it("rejects when required fields are missing", () => {
				const invalid = { id: "123" };
				expect(() => projectSchema.parse(invalid)).toThrow();
			});
		});
	});

	describe("fetchProjects", () => {
		it("fetches user projects", async () => {
			const result = await fetchProjects("user-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("fetchProject", () => {
		it("fetches a single project", async () => {
			const result = await fetchProject("project-123");

			expect(result.id).toBe("project-123");
		});
	});

	describe("createProject", () => {
		it("creates a project", async () => {
			const projectData = {
				name: "test-project",
				displayName: "Test Project",
				description: "A test project",
			};

			const result = await createProject(projectData);

			expect(result.name).toBe("test-project");
			expect(result.displayName).toBe("Test Project");
		});
	});

	describe("updateProject", () => {
		it("updates the project", async () => {
			server.use(
				http.put(`${BASE_URL}/projects/:projectId`, async ({ request }) => {
					const body = (await request.json()) as { name: string };
					return HttpResponse.json({
						data: { ...mockProject, ...body },
					});
				}),
			);

			const updateData = { name: "updated-name", description: "updated desc" };
			const result = await updateProject("project-123", updateData);

			expect(result.name).toBe("updated-name");
			expect(result.description).toBe("updated desc");
		});
	});

	describe("deleteProject", () => {
		it("deletes the project", async () => {
			await expect(deleteProject("project-123")).resolves.not.toThrow();
		});
	});
});
