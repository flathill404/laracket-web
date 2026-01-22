import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { projectMembersQueryOptions } from "@/features/projects/lib/projects";
import {
	createTicket,
	type TicketStatusType,
	ticketStatusSchema,
} from "@/features/tickets/api/tickets";
import { TicketStatusSelect } from "@/features/tickets/components/ticket-status-select";
import { projectTicketsQueryKey } from "@/features/tickets/lib/tickets";
import { useAppForm } from "@/hooks/use-app-form";
import { cn } from "@/utils"; // Assuming index.ts in utils exports cn

const createTicketSchema = z.object({
	title: z.string().min(1, "Subject is required"),
	description: z.string(),
	status: ticketStatusSchema,
	assigneeId: z.string(),
	dueDate: z.date().optional().nullable(),
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
	const [assigneeOpen, setAssigneeOpen] = useState(false);

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
			assigneeId: "",
			dueDate: undefined as Date | undefined,
		},
		validators: {
			onSubmit: createTicketSchema,
		},
		onSubmit: async ({ value }) => {
			mutate({
				...value,
				dueDate: value.dueDate ? value.dueDate.toISOString() : undefined,
			});
		},
	});

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-[90%] sm:max-w-xl overflow-y-auto">
				<SheetHeader>
					<SheetTitle>New Ticket</SheetTitle>
					<SheetDescription>
						Create a new ticket for this project.
					</SheetDescription>
				</SheetHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-6 py-6"
				>
					{/* Subject */}
					<form.Field name="title">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor="title"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Subject
								</label>
								<Input
									id="title"
									placeholder="e.g. Fix login page layout"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									autoFocus
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-sm text-destructive">
										{field.state.meta.errors.join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>

					{/* Description */}
					<form.Field name="description">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor="description"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Description
								</label>
								<Textarea
									id="description"
									placeholder="Describe the issue or task..."
									className="min-h-[120px]"
									value={field.state.value || ""}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>

					<div className="grid grid-cols-2 gap-4">
						{/* Status */}
						<form.Field name="status">
							{(field) => (
								<div className="space-y-2">
									<label
										htmlFor="status-select"
										className="text-sm font-medium leading-none"
									>
										Status
									</label>
									<TicketStatusSelect
										value={field.state.value || "open"}
										onValueChange={field.handleChange}
										className="w-full"
									/>
								</div>
							)}
						</form.Field>

						{/* Due Date */}
						<form.Field name="dueDate">
							{(field) => (
								<div className="space-y-2">
									<label
										htmlFor="due-date-trigger"
										className="text-sm font-medium leading-none"
									>
										Due Date
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												id="due-date-trigger"
												variant={"outline"}
												className={cn(
													"w-full justify-start text-left font-normal",
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
												selected={field.state.value}
												onSelect={field.handleChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							)}
						</form.Field>
					</div>

					{/* Assignee */}
					<form.Field name="assigneeId">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor="assignee-trigger"
									className="text-sm font-medium leading-none"
								>
									Assignee
								</label>
								<Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
									<PopoverTrigger asChild>
										<Button
											id="assignee-trigger"
											variant="outline"
											role="combobox"
											aria-expanded={assigneeOpen}
											className="w-full justify-between"
										>
											{field.state.value
												? members.find((m) => m.id === field.state.value)?.name
												: "Select assignee..."}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="Search team..." />
											<CommandList>
												<CommandEmpty>No member found.</CommandEmpty>
												<CommandGroup>
													{members.map((member) => (
														<CommandItem
															key={member.id}
															value={member.name}
															onSelect={() => {
																field.handleChange(
																	field.state.value === member.id
																		? ""
																		: member.id,
																);
																setAssigneeOpen(false);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	field.state.value === member.id
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															<div className="flex items-center gap-2">
																<Avatar className="h-5 w-5">
																	<AvatarImage
																		src={member.avatarUrl ?? undefined}
																	/>
																	<AvatarFallback className="text-[10px]">
																		{member.name.slice(0, 2).toUpperCase()}
																	</AvatarFallback>
																</Avatar>
																<span>{member.name}</span>
															</div>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>
						)}
					</form.Field>

					<SheetFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Creating..." : "Create Ticket"}
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
