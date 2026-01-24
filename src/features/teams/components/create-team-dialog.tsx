import { useForm } from "@tanstack/react-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import { queryKeys } from "@/lib/query-keys";
import { createTeam } from "../api/teams";

const createTeamSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(30, "Name must be 30 characters or less")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Name can only contain letters, numbers, dashes, and underscores",
		),
	displayName: z
		.string()
		.min(1, "Display name is required")
		.max(50, "Display name must be 50 characters or less"),
});

interface CreateTeamDialogProps {
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function CreateTeamDialog({
	trigger,
	open: controlledOpen,
	onOpenChange: setControlledOpen,
}: CreateTeamDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const router = useRouter();

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen;

	const mutation = useMutationWithToast({
		mutationFn: createTeam,
		successMessage: (data) =>
			`Team ${data.displayName} has been created successfully.`,
		errorMessage: "Failed to create team. Please try again.",
		invalidateKeys: [queryKeys.teams.all()],
		onSuccess: (data) => {
			setOpen?.(false);
			router.navigate({
				to: "/teams/$teamId/tickets",
				params: { teamId: data.id },
			});
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			displayName: "",
		},
		validators: {
			onChange: createTeamSchema,
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
					<DialogTitle>Create Team</DialogTitle>
					<DialogDescription>
						Create a new team to collaborate with others.
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
										placeholder="e.g. engineering-team"
									/>
									{field.state.meta.errors ? (
										<p className="text-destructive text-sm">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</>
							)}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="displayName">Display Name</Label>
						<form.Field
							name="displayName"
							children={(field) => (
								<>
									<Input
										id="displayName"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="e.g. Engineering Team"
									/>
									{field.state.meta.errors ? (
										<p className="text-destructive text-sm">
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
							Create Team
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
