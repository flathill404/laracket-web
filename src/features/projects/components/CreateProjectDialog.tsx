import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/use-app-form";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import { queryKeys } from "@/lib/queryKeys";
import { createProject } from "../api/projects";

const createProjectSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
});

interface CreateProjectDialogProps {
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function CreateProjectDialog({
	trigger,
	open: controlledOpen,
	onOpenChange: setControlledOpen,
}: CreateProjectDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const router = useRouter();

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen;

	const mutation = useMutationWithToast({
		mutationFn: createProject,
		successMessage: (data) =>
			`Project ${data.name} has been created successfully.`,
		errorMessage: "Failed to create project. Please try again.",
		invalidateKeys: [queryKeys.projects.all()],
		onSuccess: (data) => {
			setOpen?.(false);
			router.navigate({
				to: "/projects/$projectId/tickets",
				params: { projectId: data.id },
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
		},
		validators: {
			onChange: createProjectSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Project</DialogTitle>
					<DialogDescription>
						Create a new project to start managing tickets.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="py-4"
				>
					<FieldGroup>
						<form.AppField
							name="name"
							children={(field) => (
								<field.InputField
									label="Name"
									placeholder="e.g. Laracket Web"
								/>
							)}
						/>
						<form.AppField
							name="description"
							children={(field) => (
								<field.TextareaField
									label="Description"
									placeholder="Project description..."
								/>
							)}
						/>
					</FieldGroup>
					<DialogFooter className="mt-4">
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Create Project
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
