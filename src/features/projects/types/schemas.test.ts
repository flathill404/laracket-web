import { describe, expect, it } from "vitest";
import * as schemas from "./schemas";

describe("project schemas", () => {
	const validProject = {
		id: "proj-123",
		name: "test-project",
		displayName: "Test Project",
		description: "A test project",
		createdAt: "2024-01-28T14:00:00Z",
		updatedAt: "2024-01-28T14:00:00Z",
	};

	describe("projectSchema", () => {
		it("validates valid project", () => {
			const result = schemas.projectSchema.safeParse(validProject);
			expect(result.success).toBe(true);
		});

		it("validates project with null description", () => {
			const result = schemas.projectSchema.safeParse({
				...validProject,
				description: null,
			});
			expect(result.success).toBe(true);
		});

		it("fails on invalid date format", () => {
			const result = schemas.projectSchema.safeParse({
				...validProject,
				createdAt: "invalid-date",
			});
			expect(result.success).toBe(false);
		});

		it("fails on missing required fields", () => {
			const result = schemas.projectSchema.safeParse({
				id: "proj-123",
				name: "test-project",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("createProjectInputSchema", () => {
		it("validates valid input", () => {
			const result = schemas.createProjectInputSchema.safeParse({
				name: "new-proj",
				displayName: "New Project",
				description: "Desc",
			});
			expect(result.success).toBe(true);
		});

		it("fails on empty name or displayName", () => {
			expect(
				schemas.createProjectInputSchema.safeParse({
					name: "",
					displayName: "New Project",
				}).success,
			).toBe(false);
			expect(
				schemas.createProjectInputSchema.safeParse({
					name: "new-proj",
					displayName: "",
				}).success,
			).toBe(false);
		});
	});

	describe("updateProjectInputSchema", () => {
		it("validates partial input", () => {
			const result = schemas.updateProjectInputSchema.safeParse({
				displayName: "Updated Title",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("fetchTicketsSortSchema", () => {
		it("validates allowed sort fields", () => {
			expect(schemas.fetchTicketsSortSchema.safeParse("id").success).toBe(true);
			expect(
				schemas.fetchTicketsSortSchema.safeParse("-createdAt").success,
			).toBe(true);
			expect(schemas.fetchTicketsSortSchema.safeParse("dueDate").success).toBe(
				true,
			);
		});

		it("fails on invalid sort field", () => {
			const result = schemas.fetchTicketsSortSchema.safeParse("invalid_field");
			expect(result.success).toBe(false);
		});
	});

	describe("fetchTicketsOptionsSchema", () => {
		it("validates valid options", () => {
			const result = schemas.fetchTicketsOptionsSchema.safeParse({
				filters: { status: ["open", "closed"] },
				sort: "createdAt",
				pagination: { cursor: "next-page" },
			});
			expect(result.success).toBe(true);
		});

		it("validates empty options", () => {
			const result = schemas.fetchTicketsOptionsSchema.safeParse({});
			expect(result.success).toBe(true);
		});
	});
});
