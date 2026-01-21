import { queryOptions } from "@tanstack/react-query";
import { fetchProjectMembers, fetchProjects } from "../api/projects";

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
