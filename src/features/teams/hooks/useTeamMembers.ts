import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addTeamMember,
	removeTeamMember,
	updateTeamMember,
} from "../api/teams";
import type { TeamMemberInput, UpdateTeamMemberInput } from "../types";
import { teamQueries } from "../utils/queries";

export const useTeamMembers = (teamId: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(teamQueries.members(teamId));

	const addMutation = useMutation({
		mutationFn: (input: TeamMemberInput) => addTeamMember(teamId, input),
		onSuccess: () => {
			queryClient.invalidateQueries(teamQueries.members(teamId));
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			userId,
			input,
		}: {
			userId: string;
			input: UpdateTeamMemberInput;
		}) => updateTeamMember(teamId, userId, input),
		onSuccess: () => {
			queryClient.invalidateQueries(teamQueries.members(teamId));
		},
	});

	const removeMutation = useMutation({
		mutationFn: (userId: string) => removeTeamMember(teamId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries(teamQueries.members(teamId));
		},
	});

	return {
		...query,
		actions: {
			add: addMutation,
			update: updateMutation,
			remove: removeMutation,
		},
	};
};
