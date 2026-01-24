import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
	createOrganization,
	deleteOrganization,
	fetchOrganization,
	updateOrganization,
} from "../api/organizations";
import type { UpdateOrganizationInput } from "../types";

export const useOrganization = (id: string) => {
	const queryClient = useQueryClient();

	const { data: organization, isLoading } = useQuery({
		queryKey: queryKeys.organizations.detail(id),
		queryFn: () => fetchOrganization(id),
	});

	const createOrganizationMutation = useMutation({
		mutationFn: createOrganization,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.detail(id),
			});
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.list(),
			});
		},
	});

	const updateOrganizationMutation = useMutation({
		mutationFn: (input: UpdateOrganizationInput) =>
			updateOrganization(id, input),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.detail(id),
			});
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.list(),
			});
		},
	});

	const deleteOrganizationMutation = useMutation({
		mutationFn: () => deleteOrganization(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.detail(id),
			});
			await queryClient.invalidateQueries({
				queryKey: queryKeys.organizations.list(),
			});
		},
	});

	return {
		organization,
		isLoading,
		actions: {
			create: createOrganizationMutation,
			update: updateOrganizationMutation,
			delete: deleteOrganizationMutation,
		},
	};
};
