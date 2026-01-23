import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Project, updateProject } from "@/features/projects/api/projects";
import { projectQueryOptions } from "@/features/projects/lib/projects";
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
			<div className="space-y-4">
				<form.Field name="name">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="name" className="font-medium text-sm">
								Project Name
							</label>
							<Input
								id="name"
								placeholder="Project Name"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="text-destructive text-sm">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field name="description">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="description" className="font-medium text-sm">
								Description
							</label>
							<Textarea
								id="description"
								placeholder="Project description"
								className="min-h-[120px] resize-none"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</div>
					)}
				</form.Field>
			</div>

			<Button type="submit" disabled={isPending}>
				{isPending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
