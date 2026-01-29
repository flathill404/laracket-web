import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import {
	addOrganizationMember,
	fetchOrganizationMembers,
	removeOrganizationMember,
	updateOrganizationMember,
} from "./members";

const BASE_URL = "http://localhost:8000/api";

describe("members API", () => {
	describe("fetchOrganizationMembers", () => {
		it("should fetch members", async () => {
			const result = await fetchOrganizationMembers("org-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("addOrganizationMember", () => {
		it("should add member", async () => {
			const result = await addOrganizationMember("org-123", {
				userId: "user-123",
			});

			expect(result.id).toBe("user-123");
		});
	});

	describe("updateOrganizationMember", () => {
		it("should update member", async () => {
			server.use(
				http.patch(
					`${BASE_URL}/organizations/:organizationId/members/:userId`,
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

			const result = await updateOrganizationMember("org-123", "user-123", {
				role: "owner",
			});

			expect(result.role).toBe("owner");
		});
	});

	describe("removeOrganizationMember", () => {
		it("should remove member", async () => {
			await expect(
				removeOrganizationMember("org-123", "user-123"),
			).resolves.not.toThrow();
		});
	});
});
