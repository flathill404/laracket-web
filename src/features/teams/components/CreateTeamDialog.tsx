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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import { queryKeys } from "@/lib/queryKeys";
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
					className="flex flex-col gap-4 py-4"
				>
					<form.Field
						name="name"
						children={(field) => (
							<Field data-invalid={!!field.state.meta.errors?.length}>
								<FieldLabel htmlFor={field.name}>Name</FieldLabel>
								<Input
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="e.g. engineering-team"
								/>
								<FieldError
									errors={field.state.meta.errors?.map((e) => ({
										message: String(e),
									}))}
								/>
							</Field>
						)}
					/>
					<form.Field
						name="displayName"
						children={(field) => (
							<Field data-invalid={!!field.state.meta.errors?.length}>
								<FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
								<Input
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="e.g. Engineering Team"
								/>
								<FieldError
									errors={field.state.meta.errors?.map((e) => ({
										message: String(e),
									}))}
								/>
							</Field>
						)}
					/>
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
