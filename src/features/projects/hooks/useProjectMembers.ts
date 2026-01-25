import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProjectMember, removeProjectMember } from "../api/projects";
import type { ProjectMemberInput } from "../types";
import { projectQueries } from "../utils/queries";

export const useProjectMembers = (projectId: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(projectQueries.members(projectId));

	const addMutation = useMutation({
		mutationFn: (input: ProjectMemberInput) =>
			addProjectMember(projectId, input),
		onSuccess: () => {
			queryClient.invalidateQueries(projectQueries.members(projectId));
		},
	});

	const removeMutation = useMutation({
		mutationFn: (userId: string) => removeProjectMember(projectId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries(projectQueries.members(projectId));
		},
	});

	return {
		...query,
		actions: {
			add: addMutation,
			remove: removeMutation,
		},
	};
};
