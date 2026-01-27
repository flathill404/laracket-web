import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeamMember, removeTeamMember, updateTeamMember } from "../api";
import type { TeamMemberInput, UpdateTeamMemberInput } from "../types";
import { teamQueries } from "../utils/queries";

export const useTeamMemberActions = () => {
	const queryClient = useQueryClient();

	const add = useMutation({
		mutationFn: ({ teamId, data }: { teamId: string; data: TeamMemberInput }) =>
			addTeamMember(teamId, data),
		onSuccess: (_, { teamId }) => {
			queryClient.invalidateQueries(teamQueries.members(teamId));
		},
	});

	const update = useMutation({
		mutationFn: ({
			teamId,
			userId,
			data,
		}: {
			teamId: string;
			userId: string;
			data: UpdateTeamMemberInput;
		}) => updateTeamMember(teamId, userId, data),
		onSuccess: (_, { teamId }) => {
			queryClient.invalidateQueries(teamQueries.members(teamId));
		},
	});

	const remove = useMutation({
		mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
			removeTeamMember(teamId, userId),
		onSuccess: (_, { teamId }) => {
			queryClient.invalidateQueries(teamQueries.members(teamId));
		},
	});

	return {
		add,
		update,
		remove,
	};
};
