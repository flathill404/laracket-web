import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import { organizationSchema } from "../types/schemas";
import {
	createOrganization,
	deleteOrganization,
	fetchOrganization,
	fetchOrganizations,
	updateOrganization,
} from "./organizations";

vi.mock("@/lib/client", () => ({
	client: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

const mockClient = getMockClient();

const mockOrganization = {
	id: "org-123",
	name: "test-org",
	displayName: "Test Org",
};

describe("organizations API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("schemas", () => {
		describe("organizationSchema", () => {
			it("should validate a valid organization", () => {
				expect(() => organizationSchema.parse(mockOrganization)).not.toThrow();
			});

			it("should reject missing required fields", () => {
				const invalid = { id: "123" };
				expect(() => organizationSchema.parse(invalid)).toThrow();
			});
		});
	});

	describe("fetchOrganizations", () => {
		it("should fetch user organizations", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockOrganization] }),
			});

			const result = await fetchOrganizations();

			expect(mockClient.get).toHaveBeenCalledWith("/organizations");
			expect(result).toEqual([mockOrganization]);
		});
	});

	describe("fetchOrganization", () => {
		it("should fetch single organization", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockOrganization }),
			});

			const result = await fetchOrganization("org-123");

			expect(mockClient.get).toHaveBeenCalledWith("/organizations/org-123");
			expect(result).toEqual(mockOrganization);
		});
	});

	describe("createOrganization", () => {
		it("should create organization", async () => {
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockOrganization }),
			});

			const data = { name: "test", displayName: "Test inAPI" };
			const result = await createOrganization(data);

			expect(mockClient.post).toHaveBeenCalledWith("/organizations", data);
			expect(result).toEqual(mockOrganization);
		});
	});

	describe("updateOrganization", () => {
		it("should update organization", async () => {
			const updated = { ...mockOrganization, name: "updated" };
			mockClient.put.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: updated }),
			});

			const data = { name: "updated", displayName: "Test Org" };
			const result = await updateOrganization("org-123", data);

			expect(mockClient.put).toHaveBeenCalledWith(
				"/organizations/org-123",
				data,
			);
			expect(result).toEqual(updated);
		});
	});

	describe("deleteOrganization", () => {
		it("should delete organization", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await deleteOrganization("org-123");

			expect(mockClient.delete).toHaveBeenCalledWith("/organizations/org-123");
		});
	});
});
