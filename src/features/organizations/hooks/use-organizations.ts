import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
	createOrganization,
	deleteOrganization,
	fetchOrganizations,
} from "../api/organizations";

export const useOrganizations = () => {
	const queryClient = useQueryClient();

	const { data: organizations, isLoading } = useQuery({
		queryKey: queryKeys.organizations.list(),
		queryFn: fetchOrganizations,
	});

	const createOrganizationMutation = useMutation({
		mutationFn: createOrganization,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.list(),
			});
		},
	});

	const deleteOrganizationMutation = useMutation({
		mutationFn: (id: string) => deleteOrganization(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.list(),
			});
		},
	});

	return {
		organizations,
		isLoading,
		actions: {
			create: createOrganizationMutation,
			delete: deleteOrganizationMutation,
		},
	};
};
