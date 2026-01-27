import { useSuspenseQuery } from "@tanstack/react-query";
import {
	ChevronRight,
	MoreHorizontal,
	Trash2,
	UserMinus,
	UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
} from "@/components/ui/sheet";
import { useAppForm } from "@/hooks/useAppForm";
import {
	useDeleteTeamMutation,
	useRemoveTeamMemberMutation,
	useUpdateTeamMutation,
} from "../api/mutations";
import { teamQueries } from "../api/queries";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";

interface TeamDetailSheetProps {
	teamId: string;
	organizationId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TeamDetailSheet({
	teamId,
	organizationId,
	open,
	onOpenChange,
}: TeamDetailSheetProps) {
	// Query
	const { data: team } = useSuspenseQuery(teamQueries.detail(teamId));
	const { data: members } = useSuspenseQuery(teamQueries.members(teamId));

	// Mutations
	const updateMutation = useUpdateTeamMutation(teamId);
	const deleteMutation = useDeleteTeamMutation(organizationId);
	const removeMemberMutation = useRemoveTeamMemberMutation(teamId);

	// Local State
	const [isEditingName, setIsEditingName] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);

	// Name Form
	const nameForm = useAppForm({
		defaultValues: {
			displayName: team.displayName,
		} as { displayName: string },
		validators: {
			onSubmit: z.object({ displayName: z.string().min(1) }),
		},
		onSubmit: async ({ value }) => {
			if (value.displayName === team.displayName) {
				setIsEditingName(false);
				return;
			}
			updateMutation.mutate(
				{ name: team.name, displayName: value.displayName },
				{
					onSuccess: () => setIsEditingName(false),
				},
			);
		},
	});

	// Sync form with data
	useEffect(() => {
		nameForm.setFieldValue("displayName", team.displayName);
	}, [team, nameForm]);

	const handleDelete = () => {
		deleteMutation.mutate(teamId, {
			onSuccess: () => {
				setShowDeleteDialog(false);
				onOpenChange(false);
			},
		});
	};

	const handleRemoveMember = (userId: string) => {
		removeMemberMutation.mutate(userId);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[90%] gap-0 overflow-hidden p-0 sm:max-w-5xl"
			>
				<div className="flex h-full flex-col">
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
									[Team]
								</span>
								<Separator orientation="vertical" className="h-4" />
								<div className="m-0 min-w-0 flex-1">
									{isEditingName ? (
										<form
											onSubmit={(e) => {
												e.preventDefault();
												e.stopPropagation();
												nameForm.handleSubmit();
											}}
											className="flex items-center"
										>
											<nameForm.Field name="displayName">
												{(field) => (
													<Input
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														autoFocus
														onBlur={() => nameForm.handleSubmit()}
														className="h-auto py-0.5 font-semibold text-lg"
													/>
												)}
											</nameForm.Field>
										</form>
									) : (
										<div className="flex items-center gap-2">
											<SheetTitle
												className="cursor-pointer truncate font-semibold text-lg hover:underline"
												onClick={() => setIsEditingName(true)}
											>
												{team.displayName}
											</SheetTitle>
											<span className="text-muted-foreground text-sm">
												@{team.name}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={() => setShowDeleteDialog(true)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Team
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Body */}
					<div className="flex flex-1 overflow-hidden">
						<div className="flex w-[65%] min-w-0 flex-1 flex-col bg-background">
							<div className="flex bg-muted/50 px-8 py-3">
								<h3 className="font-semibold text-sm">Members</h3>
								<div className="ml-auto">
									<Button
										variant="outline"
										size="sm"
										className="h-7 text-xs"
										onClick={() => setShowAddMemberDialog(true)}
									>
										<UserPlus className="mr-2 h-3.5 w-3.5" />
										Add Member
									</Button>
								</div>
							</div>
							<div className="flex-1 overflow-y-auto px-8 py-6">
								<div className="space-y-4">
									{members.length === 0 ? (
										<div className="py-8 text-center text-muted-foreground text-sm">
											No members yet.
										</div>
									) : (
										members.map((member) => (
											<div
												key={member.id}
												className="flex items-center justify-between border-b pb-4 last:border-0"
											>
												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9">
														<AvatarImage src={member.avatarUrl ?? undefined} />
														<AvatarFallback>
															{member.displayName.slice(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium text-sm">
															{member.displayName}
														</div>
														<div className="text-muted-foreground text-xs">
															@{member.name}
														</div>
													</div>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:text-destructive"
													onClick={() => handleRemoveMember(member.id)}
													disabled={removeMemberMutation.isPending}
												>
													<UserMinus className="h-4 w-4" />
												</Button>
											</div>
										))
									)}
								</div>
							</div>
						</div>

						<div className="w-[35%] min-w-[300px] space-y-8 overflow-y-auto border-l bg-muted/5 p-6">
							<div className="space-y-6">
								<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
									Details
								</h4>
								<div className="space-y-4">
									<div className="space-y-1">
										<span className="text-muted-foreground text-xs">ID</span>
										<div className="font-mono text-xs">{team.id}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							team <span className="font-semibold">{team.displayName}</span> and
							all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AddTeamMemberDialog
				organizationId={organizationId}
				teamId={teamId}
				open={showAddMemberDialog}
				onOpenChange={setShowAddMemberDialog}
			/>
		</Sheet>
	);
}
