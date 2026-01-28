import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationProject } from "../api";
import type { CreateOrganizationProjectInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationProjectActions = () => {
	const queryClient = useQueryClient();

	const createProject = useMutation({
		mutationFn: ({
			organizationId,
			data,
		}: {
			organizationId: string;
			data: CreateOrganizationProjectInput;
		}) => createOrganizationProject(organizationId, data),
		onSuccess: (_, { organizationId }) => {
			queryClient.invalidateQueries(
				organizationQueries.projects(organizationId),
			);
		},
	});

	return {
		createProject,
	};
};
