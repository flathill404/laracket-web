import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOrganizationProject } from "@/features/organizations/api/organizations";
import type { CreateOrganizationProjectInput } from "@/features/organizations/types";
import { organizationQueries } from "@/features/organizations/utils/queries";
import type { UpdateProjectInput } from "../types";
import { projectQueries } from "../utils/queries";
import { deleteProject, updateProject } from "./projects";

export const useCreateProjectMutation = (organizationId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateOrganizationProjectInput) =>
			createOrganizationProject(organizationId, input),
		onSuccess: () => {
			toast.success("Project created");
			queryClient.invalidateQueries(
				organizationQueries.projects(organizationId),
			);
		},
		onError: () => {
			toast.error("Failed to create project");
		},
	});
};

export const useUpdateProjectMutation = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateProjectInput) => updateProject(projectId, input),
		onSuccess: (_data) => {
			toast.success("Project updated");
			// Invalidate specific project detail
			queryClient.invalidateQueries(projectQueries.detail(projectId));
			// Also invalidate lists where this project might appear
			// We can't easily know all organization IDs here, but usually we just invalidate the list if we have context
			// For now, detail update is most important.
			// Ideally we would invalidate organizationQueries.projects(data.organizationId) if we had it.
		},
		onError: () => {
			toast.error("Failed to update project");
		},
	});
};

export const useDeleteProjectMutation = (organizationId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProject,
		onSuccess: () => {
			toast.success("Project deleted");
			queryClient.invalidateQueries(
				organizationQueries.projects(organizationId),
			);
		},
		onError: () => {
			toast.error("Failed to delete project");
		},
	});
};
