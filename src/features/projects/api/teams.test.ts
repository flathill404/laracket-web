import { describe, expect, it } from "vitest";

import { addProjectTeam, removeProjectTeam } from "./teams";

describe("teams API", () => {
	describe("addProjectTeam", () => {
		it("should add team", async () => {
			await expect(
				addProjectTeam("project-123", { teamId: "team-123" }),
			).resolves.not.toThrow();
		});
	});

	describe("removeProjectTeam", () => {
		it("should remove team", async () => {
			await expect(
				removeProjectTeam("project-123", "team-123"),
			).resolves.not.toThrow();
		});
	});
});
