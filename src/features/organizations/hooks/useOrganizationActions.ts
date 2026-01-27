import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createOrganization,
	deleteOrganization,
	updateOrganization,
} from "../api";
import type { UpdateOrganizationInput } from "../types";
import { organizationQueries } from "../utils/queries";

export const useOrganizationActions = () => {
	const queryClient = useQueryClient();

	const create = useMutation({
		mutationFn: createOrganization,
		onSuccess: () => {
			queryClient.invalidateQueries(organizationQueries.list());
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationInput }) =>
			updateOrganization(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries(organizationQueries.detail(id));
			queryClient.invalidateQueries(organizationQueries.list());
		},
	});

	const remove = useMutation({
		mutationFn: deleteOrganization,
		onSuccess: (_, id) => {
			queryClient.removeQueries(organizationQueries.detail(id));
			queryClient.invalidateQueries(organizationQueries.list());
		},
	});

	return {
		create,
		update,
		delete: remove,
	};
};
