import { queryOptions } from "@tanstack/react-query";
import {
	fetchProject,
	fetchProjectMembers,
	fetchProjects,
} from "../api/projects";

export const projectsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["projects", userId],
		queryFn: async () => {
			return await fetchProjects(userId);
		},
	});

export const projectMembersQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: ["projects", projectId, "members"],
		queryFn: () => fetchProjectMembers(projectId),
	});

export const projectQueryOptions = (projectId: string) =>
	queryOptions({
		queryKey: ["projects", projectId],
		queryFn: () => fetchProject(projectId),
	});
