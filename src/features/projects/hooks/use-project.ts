import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProject, updateProject } from "../api/projects";
import type { UpdateProjectInput } from "../types";
import { projectQueries } from "../utils/queries";

export const useProject = (id: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(projectQueries.detail(id));

	const updateMutation = useMutation({
		mutationFn: (input: UpdateProjectInput) => updateProject(id, input),
		onSuccess: async () => {
			await queryClient.invalidateQueries(projectQueries.detail(id));
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteProject(id),
		onSuccess: () => {
			queryClient.removeQueries(projectQueries.detail(id));
		},
	});

	return {
		...query,
		actions: {
			update: updateMutation,
			delete: deleteMutation,
		},
	};
};
