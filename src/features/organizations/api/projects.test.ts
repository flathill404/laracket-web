import { describe, expect, it } from "vitest";

import {
	createOrganizationProject,
	fetchOrganizationProjects,
} from "./projects";

describe("projects API", () => {
	describe("fetchOrganizationProjects", () => {
		it("should fetch projects", async () => {
			const result = await fetchOrganizationProjects("org-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("createOrganizationProject", () => {
		it("should create project", async () => {
			const data = {
				name: "test",
				displayName: "Test Project",
				description: "desc",
			};
			const result = await createOrganizationProject("org-123", data);

			expect(result.name).toBe("test");
			expect(result.displayName).toBe("Test Project");
		});
	});
});
