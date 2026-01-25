import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject } from "../api/projects";
import type { CreateProjectInput } from "../types";
import { projectQueries } from "../utils/queries";

export const useProjects = (userId: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(projectQueries.list(userId));

	const createMutation = useMutation({
		mutationFn: (input: CreateProjectInput) => createProject(input),
		onSuccess: () => {
			queryClient.invalidateQueries(projectQueries.list(userId));
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (projectId: string) => deleteProject(projectId),
		onSuccess: (_, projectId) => {
			queryClient.removeQueries(projectQueries.detail(projectId));
			queryClient.invalidateQueries(projectQueries.list(userId));
		},
	});

	return {
		...query,
		actions: {
			create: createMutation,
			delete: deleteMutation,
		},
	};
};
