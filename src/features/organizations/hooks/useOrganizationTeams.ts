import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrganizationTeam } from "../api/organizations";
import type { CreateOrganizationTeamInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationTeams = (id: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(organizationQueries.teams(id));

	const createMutation = useMutation({
		mutationFn: (input: CreateOrganizationTeamInput) =>
			createOrganizationTeam(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries(organizationQueries.teams(id));
		},
	});

	return {
		...query,
		actions: {
			create: createMutation,
		},
	};
};
