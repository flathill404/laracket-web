import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import { teamSchema } from "../types/schemas";
import { deleteTeam, fetchTeam, fetchTeams, updateTeam } from "./teams";

const BASE_URL = "http://localhost:8000/api";

const mockTeam = {
	id: "team-123",
	name: "Test Team",
	displayName: "Test Team",
};

describe("teams API", () => {
	describe("schemas", () => {
		describe("teamSchema", () => {
			it("should validate a valid team", () => {
				expect(() => teamSchema.parse(mockTeam)).not.toThrow();
			});

			it("should reject missing required fields", () => {
				expect(() => teamSchema.parse({ id: "123" })).toThrow();
			});
		});
	});

	describe("fetchTeams", () => {
		it("should fetch user teams", async () => {
			const result = await fetchTeams("user-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});

		it("should return empty array when no teams", async () => {
			server.use(
				http.get(`${BASE_URL}/users/:userId/teams`, () => {
					return HttpResponse.json({ data: [] });
				}),
			);

			const result = await fetchTeams("user-123");

			expect(result).toEqual([]);
		});
	});

	describe("fetchTeam", () => {
		it("should fetch single team", async () => {
			const result = await fetchTeam("team-123");

			expect(result.id).toBe("team-123");
		});
	});

	describe("updateTeam", () => {
		it("should update team", async () => {
			server.use(
				http.put(`${BASE_URL}/teams/:teamId`, async ({ request }) => {
					const body = (await request.json()) as { name: string };
					return HttpResponse.json({
						data: { ...mockTeam, ...body },
					});
				}),
			);

			const updateData = { name: "updated-name", displayName: "Updated Name" };
			const result = await updateTeam("team-123", updateData);

			expect(result.name).toBe("updated-name");
			expect(result.displayName).toBe("Updated Name");
		});
	});

	describe("deleteTeam", () => {
		it("should delete team", async () => {
			await expect(deleteTeam("team-123")).resolves.not.toThrow();
		});
	});
});
