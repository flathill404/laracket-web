import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProjectMember, removeProjectMember } from "../api/members";
import type { ProjectMemberInput } from "../types";
import { projectQueries } from "../utils/queries";

export const useProjectMemberActions = () => {
	const queryClient = useQueryClient();

	const addMember = useMutation({
		mutationFn: ({
			projectId,
			data,
		}: {
			projectId: string;
			data: ProjectMemberInput;
		}) => addProjectMember(projectId, data),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries(projectQueries.members(projectId));
		},
	});

	const removeMember = useMutation({
		mutationFn: ({
			projectId,
			userId,
		}: {
			projectId: string;
			userId: string;
		}) => removeProjectMember(projectId, userId),
		onSuccess: (_, { projectId }) => {
			queryClient.invalidateQueries(projectQueries.members(projectId));
		},
	});

	return {
		addMember,
		removeMember,
	};
};
