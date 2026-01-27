import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useProjectActions } from "@/features/projects/hooks/useProjectActions";
import type { Project } from "@/features/projects/types";
import { useAppForm } from "@/hooks/useAppForm";

const updateProjectSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

interface ProjectSettingsFormProps {
	project: Project;
}

export function ProjectSettingsForm({ project }: ProjectSettingsFormProps) {
	const { update } = useProjectActions();

	const handleSubmit = (values: z.infer<typeof updateProjectSchema>) => {
		update.mutate(
			{
				id: project.id,
				data: {
					...values,
					description: values.description || "",
				},
			},
			{
				onSuccess: () => {
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

			<Button type="submit" disabled={update.isPending}>
				{update.isPending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
