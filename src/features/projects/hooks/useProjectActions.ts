import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, updateProject } from "../api/projects";
import type { CreateProjectInput, UpdateProjectInput } from "../types";
import { projectQueries } from "../utils/queries";

export const useProjectActions = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: (input: CreateProjectInput) => createProject(input),
		onSuccess: () => {
			// Invalidate all projects since we don't know the exact list key (userId) easily
			// without context.
			// Assuming 'projects' is the root key for list queries.
			// Based on queries.ts: queryKeys.projects.list(userId) -> ['projects', 'list', userId]
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
			updateProject(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(projectQueries.detail(id));
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteProject(id),
		onSuccess: (_, id) => {
			queryClient.removeQueries(projectQueries.detail(id));
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});

	return {
		create,
		update,
		delete: deleteMutation,
	};
};
