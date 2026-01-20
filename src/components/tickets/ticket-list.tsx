import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Check, Circle, Filter } from "lucide-react";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getStatusColor, getStatusLabel } from "@/lib/ticket-utils";
import { cn } from "@/utils";

// Using a loose type for now to match the existing usage, but ideally this should be a shared type from the API
export interface Ticket {
	id: string;
	title: string;
	description: string;
	status: string;
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

interface TicketListProps {
	tickets: Ticket[];
	onTicketClick: (ticket: Ticket) => void;
	emptyState?: React.ReactNode;
	selectedStatuses?: string[];
	onStatusChange?: (statuses: string[]) => void;
}

const columnHelper = createColumnHelper<Ticket>();

const statuses = [
	{ value: "open", label: "Open" },
	{ value: "in_progress", label: "In Progress" },
	{ value: "in_review", label: "In Review" },
	{ value: "resolved", label: "Resolved" },
	{ value: "closed", label: "Closed" },
];

export function TicketList({
	tickets,
	onTicketClick,
	emptyState,
	selectedStatuses = [],
	onStatusChange,
}: TicketListProps) {
	const columns = [
		columnHelper.accessor((row) => row, {
			id: "subject",
			header: "Subject",
			cell: (info) => {
				const ticket = info.getValue();
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
			},
		}),
		columnHelper.accessor("status", {
			header: () => {
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
												const isSelected = selectedStatuses.includes(
													status.value,
												);
												return (
													<CommandItem
														key={status.value}
														onSelect={() => {
															if (onStatusChange) {
																const newStatuses = isSelected
																	? selectedStatuses.filter(
																			(s) => s !== status.value,
																		)
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
			},
			cell: (info) => {
				const status = info.getValue();
				return (
					<div className="flex items-center gap-2">
						<Circle className={`h-3 w-3 ${getStatusColor(status)}`} />
						<span className="text-sm">{getStatusLabel(status)}</span>
					</div>
				);
			},
			meta: {
				className: "w-[150px]",
			},
		}),
		columnHelper.accessor("assignees", {
			header: "Assignee",
			cell: (info) => {
				const assignees = info.getValue();
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
			},
			meta: {
				className: "w-[140px]",
			},
		}),
	];

	const table = useReactTable({
		data: tickets,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex-1 overflow-hidden bg-muted/5 p-6">
			<div className="flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
				<div className="flex-1 overflow-auto">
					<table className="w-full caption-bottom text-sm">
						<TableHeader className="sticky top-0 z-10 bg-muted">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow
									key={headerGroup.id}
									className="hover:bg-muted/30 border-b-muted"
								>
									{headerGroup.headers.map((header) => {
										const meta = header.column.columnDef.meta as
											| { className?: string }
											| undefined;
										return (
											<TableHead key={header.id} className={meta?.className}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										onClick={() => onTicketClick(row.original)}
										className="cursor-pointer hover:bg-muted/50"
									>
										{row.getVisibleCells().map((cell) => {
											const meta = cell.column.columnDef.meta as
												| { className?: string }
												| undefined;
											return (
												<TableCell key={cell.id} className={meta?.className}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											);
										})}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										{emptyState ?? "No tickets found."}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</table>
				</div>
				<div className="border-t p-4 text-center text-xs text-muted-foreground bg-card">
					Showing {tickets.length} tickets
				</div>
			</div>
		</div>
	);
}
