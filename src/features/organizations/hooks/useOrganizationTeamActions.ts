import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationTeam } from "../api";
import type { CreateOrganizationTeamInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationTeamActions = () => {
	const queryClient = useQueryClient();

	const createTeam = useMutation({
		mutationFn: ({
			organizationId,
			data,
		}: {
			organizationId: string;
			data: CreateOrganizationTeamInput;
		}) => createOrganizationTeam(organizationId, data),
		onSuccess: (_, { organizationId }) => {
			queryClient.invalidateQueries(organizationQueries.teams(organizationId));
		},
	});

	return {
		createTeam,
	};
};
