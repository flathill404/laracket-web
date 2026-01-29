import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import { organizationSchema } from "../types/schemas";
import {
	createOrganization,
	deleteOrganization,
	fetchOrganization,
	fetchOrganizations,
	updateOrganization,
} from "./organizations";

const BASE_URL = "http://localhost:8000/api";

const mockOrganization = {
	id: "org-123",
	name: "test-org",
	displayName: "Test Org",
};

describe("organizations API", () => {
	describe("schemas", () => {
		describe("organizationSchema", () => {
			it("validates a valid organization", () => {
				expect(() => organizationSchema.parse(mockOrganization)).not.toThrow();
			});

			it("rejects when required fields are missing", () => {
				const invalid = { id: "123" };
				expect(() => organizationSchema.parse(invalid)).toThrow();
			});
		});
	});

	describe("fetchOrganizations", () => {
		it("fetches the user organizations", async () => {
			const result = await fetchOrganizations();

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("fetchOrganization", () => {
		it("fetches a single organization", async () => {
			const result = await fetchOrganization("org-123");

			expect(result.id).toBe("org-123");
		});
	});

	describe("createOrganization", () => {
		it("creates an organization", async () => {
			const data = { name: "test", displayName: "Test inAPI" };
			const result = await createOrganization(data);

			expect(result.name).toBe("test");
			expect(result.displayName).toBe("Test inAPI");
		});
	});

	describe("updateOrganization", () => {
		it("updates an organization", async () => {
			server.use(
				http.put(
					`${BASE_URL}/organizations/:organizationId`,
					async ({ request }) => {
						const body = (await request.json()) as { name: string };
						return HttpResponse.json({
							data: { ...mockOrganization, ...body },
						});
					},
				),
			);

			const data = { name: "updated", displayName: "Test Org" };
			const result = await updateOrganization("org-123", data);

			expect(result.name).toBe("updated");
		});
	});

	describe("deleteOrganization", () => {
		it("deletes an organization", async () => {
			await expect(deleteOrganization("org-123")).resolves.not.toThrow();
		});
	});
});
