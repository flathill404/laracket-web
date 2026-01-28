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
			organizationId,
			data,
		}: {
			organizationId: string;
			data: OrganizationMemberInput;
		}) => addOrganizationMember(organizationId, data),
		onSuccess: (_, { organizationId }) => {
			queryClient.invalidateQueries(
				organizationQueries.members(organizationId),
			);
		},
	});

	const updateMember = useMutation({
		mutationFn: ({
			organizationId,
			userId,
			data,
		}: {
			organizationId: string;
			userId: string;
			data: UpdateOrganizationMemberInput;
		}) => updateOrganizationMember(organizationId, userId, data),
		onSuccess: (_, { organizationId }) => {
			queryClient.invalidateQueries(
				organizationQueries.members(organizationId),
			);
		},
	});

	const removeMember = useMutation({
		mutationFn: ({
			organizationId,
			userId,
		}: {
			organizationId: string;
			userId: string;
		}) => removeOrganizationMember(organizationId, userId),
		onSuccess: (_, { organizationId }) => {
			queryClient.invalidateQueries(
				organizationQueries.members(organizationId),
			);
		},
	});

	return {
		addMember,
		updateMember,
		removeMember,
	};
};
