import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
	const queryClient = useQueryClient();
	const router = useRouter();

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen;

	const mutation = useMutation({
		mutationFn: createProject,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			toast.success(`Project ${data.name} has been created successfully.`);
			setOpen?.(false);
			router.navigate({
				to: "/projects/$projectId/tickets",
				params: { projectId: data.id },
			});
		},
		onError: () => {
			toast.error("Failed to create project. Please try again.");
		},
	});

	const form = useForm({
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
					className="grid gap-4 py-4"
				>
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<form.Field
							name="name"
							children={(field) => (
								<>
									<Input
										id="name"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Laracket Web"
									/>
									{field.state.meta.errors ? (
										<p className="text-sm text-destructive">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</>
							)}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<form.Field
							name="description"
							children={(field) => (
								<>
									<Textarea
										id="description"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Project description..."
									/>
									{field.state.meta.errors ? (
										<p className="text-sm text-destructive">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</>
							)}
						/>
					</div>
					<DialogFooter>
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
