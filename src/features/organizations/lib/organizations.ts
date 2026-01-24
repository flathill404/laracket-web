import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
	fetchOrganization,
	fetchOrganizationMembers,
	fetchOrganizationProjects,
	fetchOrganizations,
	fetchOrganizationTeams,
} from "../api/organizations";

export const organizationsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: queryKeys.organizations.list(userId),
		queryFn: async () => {
			return await fetchOrganizations(userId);
		},
	});

export const organizationQueryOptions = (organizationId: string) =>
	queryOptions({
		queryKey: queryKeys.organizations.detail(organizationId),
		queryFn: () => fetchOrganization(organizationId),
	});

export const organizationMembersQueryOptions = (organizationId: string) =>
	queryOptions({
		queryKey: queryKeys.organizations.members(organizationId),
		queryFn: () => fetchOrganizationMembers(organizationId),
	});

export const organizationProjectsQueryOptions = (organizationId: string) =>
	queryOptions({
		queryKey: queryKeys.organizations.projects(organizationId),
		queryFn: () => fetchOrganizationProjects(organizationId),
	});

export const organizationTeamsQueryOptions = (organizationId: string) =>
	queryOptions({
		queryKey: queryKeys.organizations.teams(organizationId),
		queryFn: () => fetchOrganizationTeams(organizationId),
	});
