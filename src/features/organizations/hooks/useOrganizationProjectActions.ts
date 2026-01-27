import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationProject } from "../api";
import type { CreateOrganizationProjectInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationProjectActions = () => {
	const queryClient = useQueryClient();

	const createProject = useMutation({
		mutationFn: ({
			orgId,
			data,
		}: {
			orgId: string;
			data: CreateOrganizationProjectInput;
		}) => createOrganizationProject(orgId, data),
		onSuccess: (_, { orgId }) => {
			queryClient.invalidateQueries(organizationQueries.projects(orgId));
		},
	});

	return {
		createProject,
	};
};
