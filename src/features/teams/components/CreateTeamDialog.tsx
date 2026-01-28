import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { useAppForm } from "@/hooks/useAppForm";
import { queryKeys } from "@/lib/queryKeys";
import { createTeam } from "../api";
import { createTeamInputSchema } from "../types/schemas";

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
	const queryClient = useQueryClient();

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen;

	const mutation = useMutation({
		mutationFn: createTeam,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.teams.all() });
			toast.success(`Team ${data.displayName} has been created successfully.`);
			setOpen?.(false);
			router.navigate({
				to: "/teams/$teamId/tickets",
				params: { teamId: data.id },
			});
		},
		onError: () => {
			toast.error("Failed to create team. Please try again.");
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
			displayName: "",
		},
		validators: {
			onSubmit: createTeamInputSchema,
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
					<form.Field name="name">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor={field.name}
									className="font-medium text-sm leading-none"
								>
									Name
								</label>
								<Input
									id={field.name}
									placeholder="e.g. engineering-team"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.length > 0 && (
									<p
										className="font-medium text-destructive text-sm"
										data-testid="error-name"
									>
										{field.state.meta.errors
											.map((e: unknown) =>
												typeof e === "object" && e !== null && "message" in e
													? (e as { message: string }).message
													: String(e),
											)
											.join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>
					<form.Field name="displayName">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor={field.name}
									className="font-medium text-sm leading-none"
								>
									Display Name
								</label>
								<Input
									id={field.name}
									placeholder="e.g. Engineering Team"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.length > 0 && (
									<p
										className="font-medium text-destructive text-sm"
										data-testid="error-displayName"
									>
										{field.state.meta.errors
											.map((e: unknown) =>
												typeof e === "object" && e !== null && "message" in e
													? (e as { message: string }).message
													: String(e),
											)
											.join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>
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
