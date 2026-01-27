import { useQueryClient } from "@tanstack/react-query";
import { createOrganizationTeam } from "@/features/organizations/api/organizations";
import type { CreateOrganizationTeamInput } from "@/features/organizations/types";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import type {
	TeamMemberInput,
	UpdateTeamInput,
	UpdateTeamMemberInput,
} from "../types";
import { teamQueries } from "./queries";
import {
	addTeamMember,
	deleteTeam,
	removeTeamMember,
	updateTeam,
	updateTeamMember,
} from "./teams";

export const useCreateTeamMutation = (organizationId: string) => {
	return useMutationWithToast({
		mutationFn: (input: CreateOrganizationTeamInput) =>
			createOrganizationTeam(organizationId, input),
		successMessage: "Team created",
		errorMessage: "Failed to create team",
		invalidateKeys: [organizationQueries.teams(organizationId).queryKey],
	});
};

export const useUpdateTeamMutation = (teamId: string) => {
	const queryClient = useQueryClient();

	return useMutationWithToast({
		mutationFn: (input: UpdateTeamInput) => updateTeam(teamId, input),
		successMessage: "Team updated",
		errorMessage: "Failed to update team",
		onSuccess: (_data) => {
			queryClient.invalidateQueries(teamQueries.detail(teamId));
			// Note: We might want to invalidate the organization teams list too,
			// but we don't have organizationId here easily.
		},
	});
};

export const useDeleteTeamMutation = (organizationId: string) => {
	return useMutationWithToast({
		mutationFn: deleteTeam,
		successMessage: "Team deleted",
		errorMessage: "Failed to delete team",
		invalidateKeys: [organizationQueries.teams(organizationId).queryKey],
	});
};

export const useAddTeamMemberMutation = (teamId: string) => {
	return useMutationWithToast({
		mutationFn: (input: TeamMemberInput) => addTeamMember(teamId, input),
		successMessage: "Member added to team",
		errorMessage: "Failed to add member",
		invalidateKeys: [teamQueries.members(teamId).queryKey],
	});
};

export const useUpdateTeamMemberMutation = (teamId: string) => {
	return useMutationWithToast({
		mutationFn: ({
			userId,
			input,
		}: {
			userId: string;
			input: UpdateTeamMemberInput;
		}) => updateTeamMember(teamId, userId, input),
		successMessage: "Member updated",
		errorMessage: "Failed to update member",
		invalidateKeys: [teamQueries.members(teamId).queryKey],
	});
};

export const useRemoveTeamMemberMutation = (teamId: string) => {
	return useMutationWithToast({
		mutationFn: (userId: string) => removeTeamMember(teamId, userId),
		successMessage: "Member removed from team",
		errorMessage: "Failed to remove member",
		invalidateKeys: [teamQueries.members(teamId).queryKey],
	});
};
