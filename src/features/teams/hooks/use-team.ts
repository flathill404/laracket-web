import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTeam, updateTeam } from "../api/teams";
import type { UpdateTeamInput } from "../types";
import { teamQueries } from "../utils/queries";

export const useTeam = (id: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(teamQueries.detail(id));

	const updateMutation = useMutation({
		mutationFn: (input: UpdateTeamInput) => updateTeam(id, input),
		onSuccess: async () => {
			await queryClient.invalidateQueries(teamQueries.detail(id));
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteTeam(id),
		onSuccess: () => {
			queryClient.removeQueries(teamQueries.detail(id));
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
