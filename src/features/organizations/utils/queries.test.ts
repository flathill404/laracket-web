import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/queryKeys";
import * as api from "../api";
import { organizationQueries } from "./queries";

vi.mock("../api", () => ({
	fetchOrganizations: vi.fn(),
	fetchOrganization: vi.fn(),
	fetchOrganizationMembers: vi.fn(),
	fetchOrganizationProjects: vi.fn(),
	fetchOrganizationTeams: vi.fn(),
}));

describe("organizationQueries", () => {
	const organizationId = "org-1";

	describe("list", () => {
		it("returns the correct query options", () => {
			const options = organizationQueries.list();
			expect(options.queryKey).toEqual(queryKeys.organizations.list());
			expect(options.queryFn).toBeDefined();
		});

		it("calls fetchOrganizations", async () => {
			const options = organizationQueries.list();
			// biome-ignore lint/suspicious/noExplicitAny: Mock query context
			await options.queryFn?.({} as any);
			expect(api.fetchOrganizations).toHaveBeenCalled();
		});
	});

	describe("detail", () => {
		it("returns the correct query options", () => {
			const options = organizationQueries.detail(organizationId);
			expect(options.queryKey).toEqual(
				queryKeys.organizations.detail(organizationId),
			);
			expect(options.enabled).toBe(true);
		});

		it("calls fetchOrganization", async () => {
			const options = organizationQueries.detail(organizationId);
			// biome-ignore lint/suspicious/noExplicitAny: Mock query context
			await options.queryFn?.({} as any);
			expect(api.fetchOrganization).toHaveBeenCalledWith(organizationId);
		});

		it("is disabled when the ID is missing", () => {
			const options = organizationQueries.detail("");
			expect(options.enabled).toBe(false);
		});
	});

	describe("members", () => {
		it("returns the correct query options", () => {
			const options = organizationQueries.members(organizationId);
			expect(options.queryKey).toEqual(
				queryKeys.organizations.members(organizationId),
			);
			expect(options.enabled).toBe(true);
		});

		it("calls fetchOrganizationMembers", async () => {
			const options = organizationQueries.members(organizationId);
			// biome-ignore lint/suspicious/noExplicitAny: Mock query context
			await options.queryFn?.({} as any);
			expect(api.fetchOrganizationMembers).toHaveBeenCalledWith(organizationId);
		});
	});

	describe("projects", () => {
		it("returns the correct query options", () => {
			const options = organizationQueries.projects(organizationId);
			expect(options.queryKey).toEqual(
				queryKeys.organizations.projects(organizationId),
			);
			expect(options.enabled).toBe(true);
		});

		it("calls fetchOrganizationProjects", async () => {
			const options = organizationQueries.projects(organizationId);
			// biome-ignore lint/suspicious/noExplicitAny: Mock query context
			await options.queryFn?.({} as any);
			expect(api.fetchOrganizationProjects).toHaveBeenCalledWith(
				organizationId,
			);
		});
	});

	describe("teams", () => {
		it("returns the correct query options", () => {
			const options = organizationQueries.teams(organizationId);
			expect(options.queryKey).toEqual(
				queryKeys.organizations.teams(organizationId),
			);
			expect(options.enabled).toBe(true);
		});

		it("calls fetchOrganizationTeams", async () => {
			const options = organizationQueries.teams(organizationId);
			// biome-ignore lint/suspicious/noExplicitAny: Mock query context
			await options.queryFn?.({} as any);
			expect(api.fetchOrganizationTeams).toHaveBeenCalledWith(organizationId);
		});
	});
});
