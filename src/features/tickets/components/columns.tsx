import type { ColumnDef } from "@tanstack/react-table";
import { Check, Circle, Filter, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";
import { getStatusColor, getStatusLabel } from "../utils";

// Using a loose type for now to match the existing usage, but ideally this should be a shared type from the API
export interface Ticket {
	id: string;
	title: string;
	description: string;
	status: string;
	dueDate?: string | null;
	assignees: Array<{
		id: string;
		name: string;
		avatarUrl?: string | null;
	}>;
	// Add other fields if needed for display
	// Allow for extra properties from the API response
	// biome-ignore lint/suspicious/noExplicitAny: allow loose typing for ticket
	[key: string]: any;
}

export interface TicketTableMeta {
	selectedStatuses: string[];
	onStatusChange: (statuses: string[]) => void;
	onDeleteTicket?: (ticketId: string) => void;
}

export const statuses = [
	{ value: "open", label: "Open" },
	{ value: "in_progress", label: "In Progress" },
	{ value: "in_review", label: "In Review" },
	{ value: "resolved", label: "Resolved" },
	{ value: "closed", label: "Closed" },
];

export const columns: ColumnDef<Ticket>[] = [
	{
		accessorKey: "subject",
		header: "Subject",
		cell: ({ row }) => <SubjectCell ticket={row.original} />,
		meta: {
			className: "flex-1 min-w-0 pr-4",
		},
	},
	{
		accessorKey: "status",
		header: ({ table }) => {
			const meta = table.options.meta as TicketTableMeta | undefined;
			return (
				<StatusHeader
					selectedStatuses={meta?.selectedStatuses ?? []}
					onStatusChange={meta?.onStatusChange}
				/>
			);
		},
		cell: ({ getValue }) => <StatusCell status={getValue() as string} />,
		meta: {
			className: "w-[150px]",
		},
	},
	{
		accessorKey: "assignees",
		header: "Assignee",
		cell: ({ getValue }) => (
			<AssigneeCell assignees={getValue() as Ticket["assignees"]} />
		),
		meta: {
			className: "w-[140px]",
		},
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
		cell: ({ getValue }) => (
			<DueDateCell dueDate={getValue() as string | null | undefined} />
		),
		meta: {
			className: "w-[120px]",
		},
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row, table }) => {
			const ticket = row.original;
			const meta = table.options.meta as TicketTableMeta | undefined;
			const onDeleteTicket = meta?.onDeleteTicket;

			return <ActionsCell ticket={ticket} onDeleteTicket={onDeleteTicket} />;
		},
		meta: {
			className: "w-[50px]",
		},
	},
];

function SubjectCell({ ticket }: { ticket: Ticket }) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<span className="font-medium">
					[T-{ticket.id.slice(-8)}] {ticket.title}
				</span>
			</div>
			<span className="text-xs text-muted-foreground line-clamp-1">
				{ticket.description}
			</span>
		</div>
	);
}

function StatusHeader({
	selectedStatuses,
	onStatusChange,
}: {
	selectedStatuses: string[];
	onStatusChange?: (statuses: string[]) => void;
}) {
	return (
		<div className="flex items-center space-x-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"-ml-3 h-8 data-[state=open]:bg-accent hover:bg-accent/50",
							selectedStatuses.length > 0 &&
								"bg-accent/50 text-accent-foreground font-medium",
						)}
					>
						<span>Status</span>
						{selectedStatuses.length > 0 && (
							<Badge
								variant="secondary"
								className="ml-2 rounded-sm px-1 font-normal"
							>
								{selectedStatuses.length}
							</Badge>
						)}
						<Filter
							className={cn(
								"ml-2 h-4 w-4",
								selectedStatuses.length > 0
									? "text-primary fill-primary/20"
									: "text-muted-foreground",
							)}
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0" align="start">
					<Command>
						<CommandList>
							<CommandGroup>
								{statuses.map((status) => {
									const isSelected = selectedStatuses.includes(status.value);
									return (
										<CommandItem
											key={status.value}
											onSelect={() => {
												if (onStatusChange) {
													const newStatuses = isSelected
														? selectedStatuses.filter((s) => s !== status.value)
														: [...selectedStatuses, status.value];
													onStatusChange(newStatuses);
												}
											}}
										>
											<div
												className={cn(
													"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
													isSelected
														? "bg-primary text-primary-foreground"
														: "opacity-50 [&_svg]:invisible",
												)}
											>
												<Check className={cn("h-4 w-4")} />
											</div>
											<span className="flex items-center gap-2">
												<Circle
													className={`h-3 w-3 ${getStatusColor(status.value)}`}
												/>
												{status.label}
											</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
							{selectedStatuses.length > 0 && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem
											onSelect={() => onStatusChange?.([])}
											className="justify-center text-center"
										>
											Clear filters
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

function StatusCell({ status }: { status: string }) {
	return (
		<div className="flex items-center gap-2">
			<Circle className={`h-3 w-3 ${getStatusColor(status)}`} />
			<span className="text-sm">{getStatusLabel(status)}</span>
		</div>
	);
}

function AssigneeCell({ assignees }: { assignees: Ticket["assignees"] }) {
	return (
		<div className="flex items-center gap-2">
			{assignees.length > 0 ? (
				assignees.map((assignee) => (
					<div key={assignee.id} className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage src={assignee.avatarUrl ?? undefined} />
							<AvatarFallback className="text-[10px]">
								{assignee.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm text-muted-foreground">
							{assignee.name}
						</span>
					</div>
				))
			) : (
				<span className="text-sm text-muted-foreground">Unassigned</span>
			)}
		</div>
	);
}

function DueDateCell({ dueDate }: { dueDate: string | null | undefined }) {
	if (!dueDate) {
		return <span className="text-sm text-muted-foreground">—</span>;
	}
	const date = new Date(dueDate);
	const formatted = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const isPastDue = date < new Date();
	return (
		<span
			className={cn("text-sm", isPastDue && "text-destructive font-medium")}
		>
			{formatted}
		</span>
	);
}

function ActionsCell({
	ticket,
	onDeleteTicket,
}: {
	ticket: Ticket;
	onDeleteTicket?: (ticketId: string) => void;
}) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={(e) => e.stopPropagation()}
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						className="text-destructive focus:text-destructive"
						onClick={(e) => {
							e.stopPropagation();
							setShowDeleteDialog(true);
						}}
					>
						<Trash className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent onClick={(e) => e.stopPropagation()}>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete ticket?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							ticket "{ticket.title}".
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={(e) => e.stopPropagation()}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={(e) => {
								e.stopPropagation();
								onDeleteTicket?.(ticket.id);
								setShowDeleteDialog(false);
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
