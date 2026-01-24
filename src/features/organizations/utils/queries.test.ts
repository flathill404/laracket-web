import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/query-keys";
import * as api from "../api/organizations";
import {
	organizationMembersQueryOptions,
	organizationProjectsQueryOptions,
	organizationQueryOptions,
	organizationsQueryOptions,
	organizationTeamsQueryOptions,
} from "./queries";

vi.mock("../api/organizations", () => ({
	fetchOrganizations: vi.fn(),
	fetchOrganization: vi.fn(),
	fetchOrganizationMembers: vi.fn(),
	fetchOrganizationProjects: vi.fn(),
	fetchOrganizationTeams: vi.fn(),
}));

describe("organizations queries", () => {
	it("organizationsQueryOptions", () => {
		const options = organizationsQueryOptions();
		expect(options.queryKey).toEqual(queryKeys.organizations.list());
		// queryFn is passed directly
		expect(options.queryFn).toBe(api.fetchOrganizations);
	});

	it("organizationQueryOptions", () => {
		const id = "org-1";
		const options = organizationQueryOptions(id);
		expect(options.queryKey).toEqual(queryKeys.organizations.detail(id));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchOrganization).toHaveBeenCalledWith(id);
	});

	it("organizationMembersQueryOptions", () => {
		const id = "org-1";
		const options = organizationMembersQueryOptions(id);
		expect(options.queryKey).toEqual(queryKeys.organizations.members(id));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchOrganizationMembers).toHaveBeenCalledWith(id);
	});

	it("organizationProjectsQueryOptions", () => {
		const id = "org-1";
		const options = organizationProjectsQueryOptions(id);
		expect(options.queryKey).toEqual(queryKeys.organizations.projects(id));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchOrganizationProjects).toHaveBeenCalledWith(id);
	});

	it("organizationTeamsQueryOptions", () => {
		const id = "org-1";
		const options = organizationTeamsQueryOptions(id);
		expect(options.queryKey).toEqual(queryKeys.organizations.teams(id));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchOrganizationTeams).toHaveBeenCalledWith(id);
	});
});
