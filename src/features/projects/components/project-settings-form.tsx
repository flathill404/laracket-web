import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { type Project, updateProject } from "@/features/projects/api/projects";
import { projectQueryOptions } from "@/features/projects/utils/queries";
import { useAppForm } from "@/hooks/use-app-form";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";

const updateProjectSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string(),
});

interface ProjectSettingsFormProps {
	project: Project;
}

export function ProjectSettingsForm({ project }: ProjectSettingsFormProps) {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutationWithToast({
		mutationFn: (values: z.infer<typeof updateProjectSchema>) =>
			updateProject(project.id, values),
		successMessage: "Project updated",
		errorMessage: "Failed to update project",
		onSuccess: (updatedProject) => {
			queryClient.setQueryData(
				projectQueryOptions(project.id).queryKey,
				updatedProject,
			);
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: project.name,
			description: project.description,
		},
		validators: {
			onSubmit: updateProjectSchema,
		},
		onSubmit: async ({ value }) => {
			mutate(value);
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
