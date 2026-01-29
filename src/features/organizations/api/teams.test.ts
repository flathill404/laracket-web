import { describe, expect, it } from "vitest";

import { createOrganizationTeam, fetchOrganizationTeams } from "./teams";

describe("teams API", () => {
	describe("fetchOrganizationTeams", () => {
		it("fetches the organization teams", async () => {
			const result = await fetchOrganizationTeams("org-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("createOrganizationTeam", () => {
		it("creates a new team", async () => {
			const data = { name: "test", displayName: "Test Team" };
			const result = await createOrganizationTeam("org-123", data);

			expect(result.name).toBe("test");
			expect(result.displayName).toBe("Test Team");
		});
	});
});
