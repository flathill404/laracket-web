import { queryOptions } from "@tanstack/react-query";
import { fetchProjects } from "../api/projects";

export const projectsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["projects", userId],
		queryFn: async () => {
			return await fetchProjects(userId);
		},
	});
