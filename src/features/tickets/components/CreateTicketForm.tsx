import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	Calendar as CalendarIcon,
	ChevronRight,
	Paperclip,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
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
import { SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { projectQueries } from "@/features/projects/utils/queries";
import { createTicket } from "@/features/tickets/api/tickets";
import { TicketStatusSelect } from "@/features/tickets/components/TicketStatusSelect";
import { TicketUserSelector } from "@/features/tickets/components/TicketUserSelector";
import type { TicketStatus } from "@/features/tickets/types";
import { ticketStatusSchema } from "@/features/tickets/types/schemas";
import { useAppForm } from "@/hooks/useAppForm";
import { useArrayField } from "@/hooks/useArrayField";
import { cn } from "@/lib";
import { formatDate } from "@/lib/date";
import { queryKeys } from "@/lib/queryKeys";

const createTicketSchema = z.object({
	title: z.string().min(1, "Subject is required"),
	description: z.string(),
	status: ticketStatusSchema,
	assigneeIds: z.array(z.string()),
	reviewerIds: z.array(z.string()),
	dueDate: z.date().nullable(),
});

export function CreateTicketForm({
	projectId,
	onOpenChange,
}: {
	projectId: string;
	onOpenChange: (open: boolean) => void;
}) {
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const { data: members } = useSuspenseQuery(projectQueries.members(projectId));

	const form = useAppForm({
		defaultValues: {
			title: "",
			description: "",
			status: "open" as TicketStatus,
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

	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: createTicket,
		onSuccess: () => {
			toast.success("Ticket created");
			queryClient.invalidateQueries({
				queryKey: queryKeys.projects.tickets(projectId),
			});
			onOpenChange(false);
			form.reset();
		},
		onError: () => {
			toast.error("Failed to create ticket");
		},
	});

	const lookupMember = useCallback(
		(id: string) => members.find((m) => m.id === id),
		[members],
	);

	const assignees = useArrayField({
		ids: form.state.values.assigneeIds,
		setIds: (ids) => form.setFieldValue("assigneeIds", ids),
		lookup: lookupMember,
	});

	const reviewers = useArrayField({
		ids: form.state.values.reviewerIds,
		setIds: (ids) => form.setFieldValue("reviewerIds", ids),
		lookup: lookupMember,
	});

	return (
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
							[New Ticket]
						</span>
						<Separator orientation="vertical" className="h-4" />
						<SheetTitle className="m-0 min-w-0 flex-1">
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
												"h-auto flex-1 rounded border-transparent bg-transparent px-1 py-0.5 font-semibold text-lg shadow-none placeholder:text-muted-foreground/50 focus-visible:border-input focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-offset-0",
												!isEditingTitle && "cursor-pointer hover:bg-muted/50",
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
				<div className="flex w-[65%] min-w-0 flex-1 flex-col bg-background">
					<div className="flex-1 overflow-y-auto px-8 py-6">
						<form.Field name="description">
							{(field) => (
								<Textarea
									placeholder="Add a description..."
									className="min-h-[300px] resize-none border-none px-0 text-base focus-visible:ring-0"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							)}
						</form.Field>
					</div>
				</div>

				{/* Sidebar Column (Right) */}
				<div className="w-[35%] min-w-[300px] space-y-8 overflow-y-auto border-l bg-muted/5 p-6">
					{/* Properties */}
					<div className="space-y-6">
						<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
							Properties
						</h4>

						<div className="space-y-5">
							{/* Assignee */}
							<TicketUserSelector
								ticketId="new"
								projectId={projectId}
								users={assignees.items}
								label="Assignees"
								addButtonLabel="+ Add Assignee"
								addButtonVariant="outline"
								addButtonClassName="h-8 text-muted-foreground border-dashed"
								onAdd={assignees.add}
								onRemove={assignees.remove}
							/>

							{/* Due Date */}
							<form.Field name="dueDate">
								{(field) => (
									<div className="space-y-2">
										<span className="font-medium text-muted-foreground text-xs">
											Due Date
										</span>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"h-8 w-full justify-start text-left font-normal",
														!field.state.value && "text-muted-foreground",
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.state.value ? (
														formatDate(field.state.value, "long")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={field.state.value ?? undefined}
													onSelect={(date) => field.handleChange(date ?? null)}
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
								ticketId="new"
								projectId={projectId}
								users={reviewers.items}
								label="Reviewers"
								addButtonLabel="+ Add Reviewer"
								addButtonVariant="outline"
								addButtonClassName="h-8 text-muted-foreground border-dashed"
								onAdd={reviewers.add}
								onRemove={reviewers.remove}
							/>
						</div>
					</div>

					<Separator />

					{/* Attachments Placeholder */}
					<div className="space-y-4">
						<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
							Attachments
						</h4>
						<button
							type="button"
							className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-8 text-muted-foreground text-sm transition-colors hover:bg-muted/50"
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
	);
}
