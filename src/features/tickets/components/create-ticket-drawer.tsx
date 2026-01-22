import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronRight,
	Paperclip,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { projectMembersQueryOptions } from "@/features/projects/lib/projects";
import {
	type TicketStatusType,
	createTicket,
	ticketStatusSchema,
	type TicketUser,
} from "@/features/tickets/api/tickets";
import { TicketStatusSelect } from "@/features/tickets/components/ticket-status-select";
import { TicketUserSelector } from "@/features/tickets/components/ticket-user-selector";
import { projectTicketsQueryKey } from "@/features/tickets/lib/tickets";
import { useAppForm } from "@/hooks/use-app-form";
import { cn } from "@/utils";

const createTicketSchema = z.object({
	title: z.string().min(1, "Subject is required"),
	description: z.string(),
	status: ticketStatusSchema,
	assigneeIds: z.array(z.string()),
	reviewerIds: z.array(z.string()),
	dueDate: z.date().nullable(),
});

interface CreateTicketDrawerProps {
	projectId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateTicketDrawer({
	projectId,
	open,
	onOpenChange,
}: CreateTicketDrawerProps) {
	const queryClient = useQueryClient();
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const { data: members = [] } = useQuery(
		projectMembersQueryOptions(projectId),
	);

	const { mutate, isPending } = useMutation({
		mutationFn: createTicket,
		onSuccess: () => {
			toast.success("Ticket created");
			queryClient.invalidateQueries({
				queryKey: projectTicketsQueryKey(projectId),
			});
			onOpenChange(false);
			form.reset();
			// Reset manual state if any
		},
		onError: (error) => {
			toast.error("Failed to create ticket");
			console.error(error);
		},
	});

	const form = useAppForm({
		defaultValues: {
			title: "",
			description: "",
			status: "open" as TicketStatusType,
			assigneeIds: [] as string[],
			reviewerIds: [] as string[],
			dueDate: null as Date | null,
		},
		validators: {
			onSubmit: createTicketSchema,
		},
		onSubmit: async ({ value }) => {
			mutate({
				...value,
				description: value.description ?? "",
				dueDate: value.dueDate ? value.dueDate.toISOString() : undefined,
			});
		},
	});

	// Helper for TicketUserSelector to work with form state
	const currentAssignees = form.state.values.assigneeIds
		.map((id) => members.find((m) => m.id === id))
		.filter((m): m is TicketUser => !!m);

	const currentReviewers = form.state.values.reviewerIds
		.map((id) => members.find((m) => m.id === id))
		.filter((m): m is TicketUser => !!m);

	const handleAddAssignee = (user: TicketUser) => {
		form.setFieldValue("assigneeIds", [
			...form.state.values.assigneeIds,
			user.id,
		]);
	};

	const handleRemoveAssignee = (userId: string) => {
		form.setFieldValue(
			"assigneeIds",
			form.state.values.assigneeIds.filter((id) => id !== userId),
		);
	};

	const handleAddReviewer = (user: TicketUser) => {
		form.setFieldValue("reviewerIds", [
			...form.state.values.reviewerIds,
			user.id,
		]);
	};

	const handleRemoveReviewer = (userId: string) => {
		form.setFieldValue(
			"reviewerIds",
			form.state.values.reviewerIds.filter((id) => id !== userId),
		);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[90%] sm:max-w-5xl p-0 gap-0 overflow-hidden"
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex flex-col h-full"
				>
					{/* Header */}
					<div className="flex items-center justify-between gap-4 px-6 py-3 border-b shrink-0 bg-background z-10">
						<div className="flex flex-1 items-center gap-4 min-w-0">
							<SheetClose asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-foreground"
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</SheetClose>
							<div className="flex flex-1 items-center gap-3 min-w-0">
								<span className="text-sm font-medium text-muted-foreground shrink-0">
									[New Ticket]
								</span>
								<Separator orientation="vertical" className="h-4" />
								<SheetTitle className="flex-1 min-w-0 m-0">
									<form.Field name="title">
										{(field) => (
											<div className="relative">
												<Input
													ref={titleInputRef}
													placeholder="Ticket Subject"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onFocus={() => setIsEditingTitle(true)}
													onBlur={() => setIsEditingTitle(false)}
													className={cn(
														"flex-1 text-lg font-semibold h-auto py-0.5 px-1 border-transparent bg-transparent shadow-none rounded focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-input focus-visible:bg-background placeholder:text-muted-foreground/50",
														!isEditingTitle &&
															"cursor-pointer hover:bg-muted/50",
													)}
												/>
											</div>
										)}
									</form.Field>
								</SheetTitle>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<form.Field name="status">
								{(field) => (
									<TicketStatusSelect
										value={field.state.value}
										onValueChange={field.handleChange}
									/>
								)}
							</form.Field>
							<Button type="submit" disabled={isPending} size="sm">
								{isPending ? "Creating..." : "Create"}
							</Button>
						</div>
					</div>

					{/* Body: 2 Columns */}
					<div className="flex flex-1 overflow-hidden">
						{/* Main Column (Left) */}
						<div className="flex-1 flex flex-col w-[65%] min-w-0 bg-background">
							<div className="flex-1 overflow-y-auto px-8 py-6">
								<form.Field name="description">
									{(field) => (
										<Textarea
											placeholder="Add a description..."
											className="min-h-[300px] border-none resize-none px-0 text-base focus-visible:ring-0"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									)}
								</form.Field>
							</div>
						</div>

						{/* Sidebar Column (Right) */}
						<div className="w-[35%] min-w-[300px] border-l bg-muted/5 overflow-y-auto p-6 space-y-8">
							{/* Properties */}
							<div className="space-y-6">
								<h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
									Properties
								</h4>

								<div className="space-y-5">
									{/* Assignee */}
									<TicketUserSelector
										ticketId="new" // Virtual ID
										projectId={projectId}
										users={currentAssignees}
										label="Assignees"
										addButtonLabel="+ Add Assignee"
										addButtonVariant="outline"
										addButtonClassName="h-8 text-muted-foreground border-dashed"
										onAdd={handleAddAssignee}
										onRemove={handleRemoveAssignee}
									/>

									{/* Due Date */}
									<form.Field name="dueDate">
										{(field) => (
											<div className="space-y-2">
												<span className="text-xs font-medium text-muted-foreground">
													Due Date
												</span>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant={"outline"}
															className={cn(
																"w-full justify-start text-left font-normal h-8",
																!field.state.value && "text-muted-foreground",
															)}
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{field.state.value ? (
																format(field.state.value, "PPP")
															) : (
																<span>Pick a date</span>
															)}
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0">
														<Calendar
															mode="single"
															selected={field.state.value ?? undefined}
															onSelect={(date) =>
																field.handleChange(date ?? null)
															}
															initialFocus
															required={false}
														/>
													</PopoverContent>
												</Popover>
											</div>
										)}
									</form.Field>

									{/* Reviewer */}
									<TicketUserSelector
										ticketId="new" // Virtual ID
										projectId={projectId}
										users={currentReviewers}
										label="Reviewers"
										addButtonLabel="+ Add Reviewer"
										addButtonVariant="outline"
										addButtonClassName="h-8 text-muted-foreground border-dashed"
										onAdd={handleAddReviewer}
										onRemove={handleRemoveReviewer}
									/>
								</div>
							</div>

							<Separator />

							{/* Attachments Placeholder */}
							<div className="space-y-4">
								<h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
									Attachments
								</h4>
								<button
									type="button"
									className="flex w-full items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm cursor-pointer hover:bg-muted/50 transition-colors"
									onClick={() => toast.info("Attachments not implemented yet")}
								>
									<div className="flex flex-col items-center gap-2">
										<Paperclip className="h-6 w-6" />
										<span>Click to upload</span>
									</div>
								</button>
							</div>
						</div>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}
