import { useQueryClient } from "@tanstack/react-query";
import { createOrganizationProject } from "@/features/organizations/api/organizations";
import type { CreateOrganizationProjectInput } from "@/features/organizations/types";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import type { UpdateProjectInput } from "../types";
import { projectQueries } from "../utils/queries";
import { deleteProject, updateProject } from "./projects";

export const useCreateProjectMutation = (organizationId: string) => {
	return useMutationWithToast({
		mutationFn: (input: CreateOrganizationProjectInput) =>
			createOrganizationProject(organizationId, input),
		successMessage: "Project created",
		errorMessage: "Failed to create project",
		invalidateKeys: [organizationQueries.projects(organizationId).queryKey],
	});
};

export const useUpdateProjectMutation = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutationWithToast({
		mutationFn: (input: UpdateProjectInput) => updateProject(projectId, input),
		successMessage: "Project updated",
		errorMessage: "Failed to update project",
		onSuccess: (_data) => {
			// Invalidate specific project detail
			queryClient.invalidateQueries(projectQueries.detail(projectId));
			// Also invalidate lists where this project might appear
			// We can't easily know all organization IDs here, but usually we just invalidate the list if we have context
			// For now, detail update is most important.
			// Ideally we would invalidate organizationQueries.projects(data.organizationId) if we had it.
		},
	});
};

export const useDeleteProjectMutation = (organizationId: string) => {
	return useMutationWithToast({
		mutationFn: deleteProject,
		successMessage: "Project deleted",
		errorMessage: "Failed to delete project",
		invalidateKeys: [organizationQueries.projects(organizationId).queryKey],
	});
};
