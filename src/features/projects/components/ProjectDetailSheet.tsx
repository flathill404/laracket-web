import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
	Calendar as CalendarIcon,
	ChevronRight,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { useProjectActions } from "@/features/projects/hooks/useProjectActions";
import { useAppForm } from "@/hooks/useAppForm";
import { formatDate } from "@/lib/date";
import { projectQueries } from "../utils/queries";

interface ProjectDetailSheetProps {
	projectId: string;
	organizationId?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ProjectDetailSheet({
	projectId,
	organizationId,
	open,
	onOpenChange,
}: ProjectDetailSheetProps) {
	// Query
	const { data: project } = useSuspenseQuery(projectQueries.detail(projectId));
	const queryClient = useQueryClient();

	// Mutations
	const { update: updateMutation, delete: deleteMutation } =
		useProjectActions();

	// Local State
	const [isEditingName, setIsEditingName] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	// Name Form
	const nameForm = useAppForm({
		defaultValues: {
			name: project.name,
		},
		validators: {
			onSubmit: z.object({ name: z.string().min(1) }),
		},
		onSubmit: async ({ value }) => {
			if (value.name === project.name) {
				setIsEditingName(false);
				return;
			}
			updateMutation.mutate(
				{ id: projectId, data: { name: value.name } },
				{
					onSuccess: () => {
						setIsEditingName(false);
						toast.success("Project updated");
					},
					onError: () => {
						toast.error("Failed to update project");
					},
				},
			);
		},
	});

	// Description Form
	const descriptionForm = useAppForm({
		defaultValues: {
			description: project.description ?? "",
		},
		validators: {
			onSubmit: z.object({ description: z.string() }),
		},
		onSubmit: async ({ value }) => {
			if (value.description !== project.description) {
				updateMutation.mutate(
					{ id: projectId, data: { description: value.description } },
					{
						onSuccess: () => {
							toast.success("Project updated");
						},
						onError: () => {
							toast.error("Failed to update project");
						},
					},
				);
			}
		},
	});

	// Sync forms with data
	useEffect(() => {
		nameForm.setFieldValue("name", project.name);
		descriptionForm.setFieldValue("description", project.description ?? "");
	}, [project, nameForm, descriptionForm]);

	const handleDelete = () => {
		deleteMutation.mutate(projectId, {
			onSuccess: () => {
				if (organizationId) {
					queryClient.invalidateQueries(
						organizationQueries.projects(organizationId),
					);
				}
				toast.success("Project deleted");
				setShowDeleteDialog(false);
				onOpenChange(false);
			},
			onError: () => {
				toast.error("Failed to delete project");
			},
		});
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
									[Project]
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
											<nameForm.Field name="name">
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
										<SheetTitle
											className="cursor-pointer truncate font-semibold text-lg hover:underline"
											onClick={() => setIsEditingName(true)}
										>
											{project.name}
										</SheetTitle>
									)}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">Open menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={() => setShowDeleteDialog(true)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Project
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Body */}
					<div className="flex flex-1 overflow-hidden">
						<div className="flex w-[65%] min-w-0 flex-1 flex-col bg-background">
							<div className="flex-1 overflow-y-auto px-8 py-6">
								<div className="space-y-6">
									<div className="space-y-2">
										<div className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
											Description
										</div>
										<descriptionForm.Field name="description">
											{(field) => (
												<Textarea
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Add a description..."
													className="min-h-[200px] resize-none border-none p-0 text-base shadow-none focus-visible:ring-0"
													onBlur={() => descriptionForm.handleSubmit()}
												/>
											)}
										</descriptionForm.Field>
									</div>
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
										<div className="font-mono text-xs">{project.id}</div>
									</div>
									<div className="space-y-1">
										<span className="text-muted-foreground text-xs">
											Created At
										</span>
										<div className="flex items-center gap-2 text-sm">
											<CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
											{formatDate(project.createdAt, "short")}
										</div>
									</div>
									<div className="space-y-1">
										<span className="text-muted-foreground text-xs">
											Updated At
										</span>
										<div className="flex items-center gap-2 text-sm">
											<CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
											{formatDate(project.updatedAt, "short")}
										</div>
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
							project <span className="font-semibold">{project.name}</span> and
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
		</Sheet>
	);
}
