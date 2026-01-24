import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
	fetchProject,
	fetchProjectMembers,
	fetchProjects,
} from "../api/projects";

export const projectsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: queryKeys.projects.list(userId),
		queryFn: async () => {
			return await fetchProjects(userId);
		},
	});

export const projectMembersQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: queryKeys.projects.members(projectId),
		queryFn: () => fetchProjectMembers(projectId),
	});

export const projectQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: queryKeys.projects.detail(projectId),
		queryFn: () => fetchProject(projectId),
	});
