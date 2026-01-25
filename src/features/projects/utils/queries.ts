import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
	fetchProject,
	fetchProjectMembers,
	fetchProjects,
} from "../api/projects";

export const projectQueries = {
	list: (userId: string) =>
		queryOptions({
			queryKey: queryKeys.projects.list(userId),
			queryFn: () => fetchProjects(userId),
			enabled: !!userId,
		}),

	detail: (projectId: string) =>
		queryOptions({
			queryKey: queryKeys.projects.detail(projectId),
			queryFn: () => fetchProject(projectId),
			enabled: !!projectId,
		}),

	members: (projectId: string) =>
		queryOptions({
			queryKey: queryKeys.projects.members(projectId),
			queryFn: () => fetchProjectMembers(projectId),
			enabled: !!projectId,
		}),
};
