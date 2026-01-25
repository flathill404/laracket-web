import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, deleteTeam } from "../api/teams";
import type { CreateTeamInput } from "../types";
import { teamQueries } from "../utils/queries";

export const useTeams = (userId: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(teamQueries.list(userId));

	const createMutation = useMutation({
		mutationFn: (input: CreateTeamInput) => createTeam(input),
		onSuccess: () => {
			queryClient.invalidateQueries(teamQueries.list(userId));
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (teamId: string) => deleteTeam(teamId),
		onSuccess: (_, teamId) => {
			queryClient.removeQueries(teamQueries.detail(teamId));
			queryClient.invalidateQueries(teamQueries.list(userId));
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
