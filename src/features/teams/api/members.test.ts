import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import {
	addTeamMember,
	fetchTeamMembers,
	removeTeamMember,
	updateTeamMember,
} from "./members";

const BASE_URL = "http://localhost:8000/api";

describe("members API", () => {
	describe("fetchTeamMembers", () => {
		it("should fetch members", async () => {
			const result = await fetchTeamMembers("team-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("addTeamMember", () => {
		it("should add member", async () => {
			const result = await addTeamMember("team-123", { userId: "user-123" });

			expect(result.id).toBe("user-123");
		});
	});

	describe("updateTeamMember", () => {
		it("should update member", async () => {
			server.use(
				http.patch(
					`${BASE_URL}/teams/:teamId/members/:userId`,
					async ({ request }) => {
						const body = (await request.json()) as { role: string };
						return HttpResponse.json({
							data: {
								id: "user-123",
								name: "john_doe",
								displayName: "John Doe",
								avatarUrl: null,
								role: body.role,
							},
						});
					},
				),
			);

			const result = await updateTeamMember("team-123", "user-123", {
				role: "leader",
			});

			expect(result.role).toBe("leader");
		});
	});

	describe("removeTeamMember", () => {
		it("should remove member", async () => {
			await expect(
				removeTeamMember("team-123", "user-123"),
			).resolves.not.toThrow();
		});
	});
});
