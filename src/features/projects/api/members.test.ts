import { describe, expect, it } from "vitest";

import {
	addProjectMember,
	fetchProjectMembers,
	removeProjectMember,
} from "./members";

describe("members API", () => {
	describe("fetchProjectMembers", () => {
		it("should fetch project members", async () => {
			const result = await fetchProjectMembers("project-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("addProjectMember", () => {
		it("should add member", async () => {
			const result = await addProjectMember("project-123", {
				userId: "user-123",
			});

			expect(result.id).toBe("user-123");
		});
	});

	describe("removeProjectMember", () => {
		it("should remove member", async () => {
			await expect(
				removeProjectMember("project-123", "user-123"),
			).resolves.not.toThrow();
		});
	});
});
