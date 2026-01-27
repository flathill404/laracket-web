import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrganization, updateOrganization } from "../api";
import type { UpdateOrganizationInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganization = (id: string) => {
	const queryClient = useQueryClient();

	const query = useQuery(organizationQueries.detail(id));

	const updateMutation = useMutation({
		mutationFn: (input: UpdateOrganizationInput) =>
			updateOrganization(id, input),
		onSuccess: async () => {
			await queryClient.invalidateQueries(organizationQueries.detail(id));
			await queryClient.invalidateQueries(organizationQueries.list());
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteOrganization(id),
		onSuccess: () => {
			return Promise.all([
				queryClient.removeQueries(organizationQueries.detail(id)),
				queryClient.invalidateQueries(organizationQueries.list()),
			]);
		},
	});

	return {
		...query,
		actions: {
			update: updateMutation,
			delete: deleteMutation,
		},
	};
};
