import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationTeam } from "../api";
import type { CreateOrganizationTeamInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationTeamActions = () => {
	const queryClient = useQueryClient();

	const createTeam = useMutation({
		mutationFn: ({
			orgId,
			data,
		}: {
			orgId: string;
			data: CreateOrganizationTeamInput;
		}) => createOrganizationTeam(orgId, data),
		onSuccess: (_, { orgId }) => {
			queryClient.invalidateQueries(organizationQueries.teams(orgId));
		},
	});

	return {
		createTeam,
	};
};
