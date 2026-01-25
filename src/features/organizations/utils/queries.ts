import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
	fetchOrganization,
	fetchOrganizationMembers,
	fetchOrganizationProjects,
	fetchOrganizations,
	fetchOrganizationTeams,
} from "../api/organizations";

export const organizationQueries = {
	list: () =>
		queryOptions({
			queryKey: queryKeys.organizations.list(),
			queryFn: fetchOrganizations,
		}),

	detail: (id: string) =>
		queryOptions({
			queryKey: queryKeys.organizations.detail(id),
			queryFn: () => fetchOrganization(id),
			enabled: !!id,
		}),

	members: (id: string) =>
		queryOptions({
			queryKey: queryKeys.organizations.members(id),
			queryFn: () => fetchOrganizationMembers(id),
			enabled: !!id,
		}),

	projects: (id: string) =>
		queryOptions({
			queryKey: queryKeys.organizations.projects(id),
			queryFn: () => fetchOrganizationProjects(id),
			enabled: !!id,
		}),

	teams: (id: string) =>
		queryOptions({
			queryKey: queryKeys.organizations.teams(id),
			queryFn: () => fetchOrganizationTeams(id),
			enabled: !!id,
		}),
};
