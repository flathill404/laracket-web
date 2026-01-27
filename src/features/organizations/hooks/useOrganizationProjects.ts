import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrganizationProject } from "../api";
import type { CreateOrganizationProjectInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationProjects = (id: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(organizationQueries.projects(id));

	const createMutation = useMutation({
		mutationFn: (input: CreateOrganizationProjectInput) =>
			createOrganizationProject(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries(organizationQueries.projects(id));
		},
	});

	return {
		...query,
		actions: {
			create: createMutation,
		},
	};
};
