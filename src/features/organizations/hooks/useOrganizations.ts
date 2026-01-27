import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrganization, deleteOrganization } from "../api";
import { organizationQueries } from "../utils";

export const useOrganizations = () => {
	const queryClient = useQueryClient();

	const query = useQuery(organizationQueries.list());

	const createMutation = useMutation({
		mutationFn: createOrganization,
		onSuccess: () => {
			queryClient.invalidateQueries(organizationQueries.list());
		},
	});

	const deleteMutaion = useMutation({
		mutationFn: (id: string) => deleteOrganization(id),
		onSuccess: (_, id) => {
			return Promise.all([
				queryClient.removeQueries(organizationQueries.detail(id)),
				queryClient.invalidateQueries(organizationQueries.list()),
			]);
		},
	});

	return {
		...query,
		actions: {
			create: createMutation,
			delete: deleteMutaion,
		},
	};
};
