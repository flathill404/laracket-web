import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam, deleteTeam, updateTeam } from "../api";
import type { CreateTeamInput, UpdateTeamInput } from "../types";
import { teamQueries } from "../utils/queries";

export const useTeamActions = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: (input: CreateTeamInput) => createTeam(input),
		onSuccess: () => {
			// Invalidate generic teams list key since we don't have userId context here easily
			// to target specific list(userId).
			// Assuming 'teams' is the root key.
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTeamInput }) =>
			updateTeam(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(teamQueries.detail(id));
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteTeam(id),
		onSuccess: (_, id) => {
			queryClient.removeQueries(teamQueries.detail(id));
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});

	return {
		create,
		update,
		delete: deleteMutation,
	};
};
