import {
	flexRender,
	getCoreRowModel,
	type OnChangeFn,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { columns, type Ticket } from "./columns";

interface TicketListProps {
	tickets: Ticket[];
	onTicketClick: (ticket: Ticket) => void;
	emptyState?: React.ReactNode;
	selectedStatuses?: string[];
	onStatusChange?: (statuses: string[]) => void;
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;
}

export function TicketList({
	tickets,
	onTicketClick,
	emptyState,
	selectedStatuses = [],
	onStatusChange,
	sorting,
	onSortingChange,
}: TicketListProps) {
	const table = useReactTable({
		data: tickets,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualSorting: true,
		enableSortingRemoval: true,
		onSortingChange,
		state: {
			sorting,
		},
		meta: {
			selectedStatuses,
			onStatusChange: onStatusChange ?? (() => {}),
		},
	});

	return (
		<div className="flex-1 overflow-hidden bg-muted/5 p-6">
			<div className="flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
				{/* Header - Fixed, not scrollable */}
				<Table className="table-fixed">
					<TableHeader className="bg-muted/50 backdrop-blur-sm">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-transparent border-b-muted"
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
				</Table>

				{/* Body - Scrollable */}
				<div className="flex-1 overflow-auto [scrollbar-gutter:stable]">
					<Table className="table-fixed">
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
					</Table>
				</div>

				<div className="border-t p-4 text-center text-xs text-muted-foreground bg-card">
					Showing {tickets.length} tickets
				</div>
			</div>
		</div>
	);
}
