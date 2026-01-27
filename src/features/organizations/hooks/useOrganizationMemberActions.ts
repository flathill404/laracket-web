import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useOrganizationMemberActions = () => {
	const queryClient = useQueryClient();

	const addMember = useMutation({
		mutationFn: ({
			orgId,
			data,
		}: {
			orgId: string;
			data: OrganizationMemberInput;
		}) => addOrganizationMember(orgId, data),
		onSuccess: (_, { orgId }) => {
			queryClient.invalidateQueries(organizationQueries.members(orgId));
		},
	});

	const updateMember = useMutation({
		mutationFn: ({
			orgId,
			userId,
			data,
		}: {
			orgId: string;
			userId: string;
			data: UpdateOrganizationMemberInput;
		}) => updateOrganizationMember(orgId, userId, data),
		onSuccess: (_, { orgId }) => {
			queryClient.invalidateQueries(organizationQueries.members(orgId));
		},
	});

	const removeMember = useMutation({
		mutationFn: ({ orgId, userId }: { orgId: string; userId: string }) =>
			removeOrganizationMember(orgId, userId),
		onSuccess: (_, { orgId }) => {
			queryClient.invalidateQueries(organizationQueries.members(orgId));
		},
	});

	return {
		addMember,
		updateMember,
		removeMember,
	};
};
