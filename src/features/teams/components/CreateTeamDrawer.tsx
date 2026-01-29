import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
} from "@/components/ui/sheet";
import { useOrganizationTeamActions } from "@/features/organizations/hooks/useOrganizationTeamActions";
import type { CreateTeamInput } from "@/features/teams/types";
import { createTeamInputSchema } from "@/features/teams/types/schemas";
import { useAppForm } from "@/hooks/useAppForm";

interface CreateTeamDrawerProps {
	organizationId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateTeamDrawer({
	organizationId,
	open,
	onOpenChange,
}: CreateTeamDrawerProps) {
	const { createTeam: mutation } = useOrganizationTeamActions();

	const form = useAppForm({
		defaultValues: {
			name: "",
			displayName: "",
		} as CreateTeamInput,
		validators: {
			onSubmit: createTeamInputSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync({
				organizationId: organizationId,
				data: value,
			});
			onOpenChange(false);
			form.reset();
		},
	});

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[90%] gap-0 overflow-hidden p-0 sm:max-w-2xl"
			>
				<SheetDescription className="sr-only">
					Create a new team
				</SheetDescription>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex h-full flex-col"
				>
					{/* Header */}
					<div className="z-10 flex shrink-0 items-center justify-between gap-4 border-b bg-background px-6 py-3">
						<div className="flex min-w-0 flex-1 items-center gap-4">
							<SheetClose asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-foreground"
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</SheetClose>
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<span className="shrink-0 font-medium text-muted-foreground text-sm">
									[New Team]
								</span>
								<Separator orientation="vertical" className="h-4" />
								<SheetTitle className="font-semibold text-base">
									Create Team
								</SheetTitle>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button type="submit" disabled={mutation.isPending} size="sm">
								{mutation.isPending ? "Creating..." : "Create"}
							</Button>
						</div>
					</div>

					{/* Body */}
					<div className="flex-1 overflow-y-auto p-6">
						<div className="space-y-6">
							<div className="grid gap-6 sm:grid-cols-2">
								<form.Field name="displayName">
									{(field) => (
										<div className="space-y-2">
											<label
												htmlFor={field.name}
												className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Team Name
											</label>
											<Input
												id={field.name}
												placeholder="Engineering Team"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
											/>
											{field.state.meta.errors.length > 0 && (
												<p className="font-medium text-destructive text-sm">
													{field.state.meta.errors
														.map((e: unknown) =>
															typeof e === "object" &&
															e !== null &&
															"message" in e
																? (e as { message: string }).message
																: String(e),
														)
														.join(", ")}
												</p>
											)}
										</div>
									)}
								</form.Field>

								<form.Field name="name">
									{(field) => (
										<div className="space-y-2">
											<label
												htmlFor={field.name}
												className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Slug (ID)
											</label>
											<Input
												id={field.name}
												placeholder="engineering"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
											/>
											{field.state.meta.errors.length > 0 && (
												<p className="font-medium text-destructive text-sm">
													{field.state.meta.errors
														.map((e: unknown) =>
															typeof e === "object" &&
															e !== null &&
															"message" in e
																? (e as { message: string }).message
																: String(e),
														)
														.join(", ")}
												</p>
											)}
										</div>
									)}
								</form.Field>
							</div>
						</div>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}
