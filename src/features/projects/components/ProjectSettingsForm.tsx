import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useProject } from "@/features/projects/hooks/useProject";
import type { Project } from "@/features/projects/types";
import { projectQueries } from "@/features/projects/utils/queries";
import { useAppForm } from "@/hooks/useAppForm";

const updateProjectSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

interface ProjectSettingsFormProps {
	project: Project;
}

export function ProjectSettingsForm({ project }: ProjectSettingsFormProps) {
	const queryClient = useQueryClient();

	const { actions } = useProject(project.id);
	const { mutate, isPending } = actions.update;

	const handleSubmit = (values: z.infer<typeof updateProjectSchema>) => {
		mutate(
			{
				...values,
				description: values.description || "",
			},
			{
				onSuccess: (updatedProject) => {
					// Manually update cache if needed, though useProject hook handles invalidation.
					// The original code used queryClient.setQueryData.
					// useProject hook invalidates detail. Invalidation triggers refetch.
					// setQueryData is instant.
					// If user wants instant update, setQueryData is better.
					// But useProject hook does invalidation.
					// I can keep setQueryData here if I want.
					queryClient.setQueryData(
						projectQueries.detail(project.id).queryKey,
						updatedProject,
					);
					toast.success("Project updated");
				},
				onError: () => {
					toast.error("Failed to update project");
				},
			},
		);
	};

	const form = useAppForm({
		defaultValues: {
			name: project.name,
			description: project.description ?? "",
		} as { name: string; description?: string },
		validators: {
			onSubmit: updateProjectSchema,
		},
		onSubmit: async ({ value }) => {
			handleSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="max-w-2xl space-y-8"
		>
			<FieldGroup>
				<form.AppField
					name="name"
					children={(field) => (
						<field.InputField label="Project Name" placeholder="Project Name" />
					)}
				/>
				<form.AppField
					name="description"
					children={(field) => (
						<field.TextareaField
							label="Description"
							placeholder="Project description"
							className="min-h-[120px] resize-none"
						/>
					)}
				/>
			</FieldGroup>

			<Button type="submit" disabled={isPending}>
				{isPending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
