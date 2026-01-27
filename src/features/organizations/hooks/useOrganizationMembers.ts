import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addOrganizationMember,
	removeOrganizationMember,
	updateOrganizationMember,
} from "../api";
import type {
	OrganizationMemberInput,
	UpdateOrganizationMemberInput,
} from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationMembers = (id: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(organizationQueries.members(id));

	const addMutation = useMutation({
		mutationFn: (input: OrganizationMemberInput) =>
			addOrganizationMember(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries(organizationQueries.members(id));
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			userId,
			input,
		}: {
			userId: string;
			input: UpdateOrganizationMemberInput;
		}) => updateOrganizationMember(id, userId, input),
		onSuccess: () => {
			queryClient.invalidateQueries(organizationQueries.members(id));
		},
	});

	const removeMutation = useMutation({
		mutationFn: (userId: string) => removeOrganizationMember(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries(organizationQueries.members(id));
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
