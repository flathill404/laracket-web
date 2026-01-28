import { describe, expect, it } from "vitest";
import {
	createTeamInputSchema,
	teamMemberInputSchema,
	teamMemberSchema,
	teamMembersSchema,
	teamSchema,
	teamsSchema,
	updateTeamInputSchema,
	updateTeamMemberInputSchema,
} from "./schemas";

describe("team schemas", () => {
	describe("teamSchema", () => {
		it("validates valid team", () => {
			const valid = { id: "t1", name: "team1", displayName: "Team 1" };
			expect(teamSchema.parse(valid)).toEqual(valid);
		});

		it("throws on missing fields", () => {
			expect(() => teamSchema.parse({})).toThrow();
			expect(() => teamSchema.parse({ id: "t1" })).toThrow();
		});
	});

	describe("teamsSchema", () => {
		it("validates array of teams", () => {
			const valid = [
				{ id: "t1", name: "team1", displayName: "Team 1" },
				{ id: "t2", name: "team2", displayName: "Team 2" },
			];
			expect(teamsSchema.parse(valid)).toEqual(valid);
		});

		it("validates empty array", () => {
			expect(teamsSchema.parse([])).toEqual([]);
		});

		it("throws on invalid team in array", () => {
			const invalid = [
				{ id: "t1", name: "team1", displayName: "Team 1" },
				{ id: "t2" }, // Missing required fields
			];
			expect(() => teamsSchema.parse(invalid)).toThrow();
		});
	});

	describe("teamMemberSchema", () => {
		it("validates valid team member", () => {
			const valid = {
				id: "u1",
				name: "user1",
				displayName: "User 1",
			};
			expect(teamMemberSchema.parse(valid)).toEqual(valid);
		});

		it("validates member with optional fields", () => {
			const valid = {
				id: "u1",
				name: "user1",
				displayName: "User 1",
				avatarUrl: "http://example.com/avatar.jpg",
				role: "leader",
			};
			expect(teamMemberSchema.parse(valid)).toEqual(valid);
		});

		it("validates member with null avatarUrl", () => {
			const valid = {
				id: "u1",
				name: "user1",
				displayName: "User 1",
				avatarUrl: null,
			};
			expect(teamMemberSchema.parse(valid)).toEqual(valid);
		});

		it("validates member with member role", () => {
			const valid = {
				id: "u1",
				name: "user1",
				displayName: "User 1",
				role: "member",
			};
			expect(teamMemberSchema.parse(valid)).toEqual(valid);
		});
	});

	describe("teamMembersSchema", () => {
		it("validates array of team members", () => {
			const valid = [
				{ id: "u1", name: "user1", displayName: "User 1" },
				{ id: "u2", name: "user2", displayName: "User 2", role: "leader" },
			];
			expect(teamMembersSchema.parse(valid)).toEqual(valid);
		});

		it("validates empty array", () => {
			expect(teamMembersSchema.parse([])).toEqual([]);
		});
	});

	describe("createTeamInputSchema", () => {
		it("validates valid input", () => {
			const valid = { name: "team1", displayName: "Team 1" };
			expect(createTeamInputSchema.parse(valid)).toEqual(valid);
		});

		it("validates name with valid characters", () => {
			const validNames = ["team-1", "team_1", "Team1", "TEAM"];
			for (const name of validNames) {
				const result = createTeamInputSchema.safeParse({
					name,
					displayName: "Team",
				});
				expect(result.success).toBe(true);
			}
		});

		it("throws on empty name", () => {
			expect(() =>
				createTeamInputSchema.parse({ name: "", displayName: "Team" }),
			).toThrow();
		});

		it("throws on empty displayName", () => {
			expect(() =>
				createTeamInputSchema.parse({ name: "team1", displayName: "" }),
			).toThrow();
		});

		it("throws on name with invalid characters", () => {
			const invalidNames = ["team 1", "team@1", "team.1", "team!"];
			for (const name of invalidNames) {
				const result = createTeamInputSchema.safeParse({
					name,
					displayName: "Team",
				});
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error.issues[0].message).toContain(
						"Name can only contain letters, numbers, dashes, and underscores",
					);
				}
			}
		});
	});

	describe("updateTeamInputSchema", () => {
		it("validates valid input", () => {
			const valid = { name: "team1", displayName: "Updated Team" };
			expect(updateTeamInputSchema.parse(valid)).toEqual(valid);
		});

		it("validates same as createTeamInputSchema", () => {
			const valid = { name: "team-1", displayName: "Team" };
			expect(createTeamInputSchema.parse(valid)).toEqual(
				updateTeamInputSchema.parse(valid),
			);
		});

		it("throws on invalid name", () => {
			const result = updateTeamInputSchema.safeParse({
				name: "invalid name",
				displayName: "Team",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("teamMemberInputSchema", () => {
		it("validates valid input", () => {
			const valid = { userId: "user-1" };
			expect(teamMemberInputSchema.parse(valid)).toEqual(valid);
		});

		it("throws on missing userId", () => {
			expect(() => teamMemberInputSchema.parse({})).toThrow();
		});
	});

	describe("updateTeamMemberInputSchema", () => {
		it("validates valid leader role", () => {
			const valid = { role: "leader" };
			expect(updateTeamMemberInputSchema.parse(valid)).toEqual(valid);
		});

		it("validates valid member role", () => {
			const valid = { role: "member" };
			expect(updateTeamMemberInputSchema.parse(valid)).toEqual(valid);
		});

		it("throws on invalid role", () => {
			expect(() =>
				updateTeamMemberInputSchema.parse({ role: "admin" }),
			).toThrow();
			expect(() =>
				updateTeamMemberInputSchema.parse({ role: "invalid" }),
			).toThrow();
		});

		it("throws on missing role", () => {
			expect(() => updateTeamMemberInputSchema.parse({})).toThrow();
		});
	});
});
