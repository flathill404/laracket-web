import {
	flexRender,
	getCoreRowModel,
	type OnChangeFn,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { columns, type Ticket } from "./columns";

// Base props shared between both modes
interface BaseTicketListProps {
	onTicketClick: (ticket: Ticket) => void;
	emptyState?: React.ReactNode;
	selectedStatuses?: string[];
	onStatusChange?: (statuses: string[]) => void;
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;
	isLoading?: boolean;
}

// Props for infinite scroll mode (pages from useInfiniteQuery)
interface InfiniteScrollProps extends BaseTicketListProps {
	pages: { data: Ticket[] }[];
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
	tickets?: never;
}

// Props for simple mode (flat ticket array)
interface SimpleListProps extends BaseTicketListProps {
	tickets: Ticket[];
	pages?: never;
	hasNextPage?: never;
	isFetchingNextPage?: never;
	fetchNextPage?: never;
}

type TicketListProps = InfiniteScrollProps | SimpleListProps;

const ROW_HEIGHT = 65; // Estimated row height in pixels

export function TicketList(props: TicketListProps) {
	const {
		onTicketClick,
		emptyState,
		selectedStatuses = [],
		onStatusChange,
		sorting,
		onSortingChange,
	} = props;

	// Determine mode and get tickets
	const isInfiniteMode = "pages" in props && props.pages !== undefined;

	const allTickets = useMemo(() => {
		if (isInfiniteMode) {
			return (props as InfiniteScrollProps).pages.flatMap((page) => page.data);
		}
		return (props as SimpleListProps).tickets;
	}, [isInfiniteMode, props]);

	// Infinite scroll props (with defaults for simple mode)
	const hasNextPage = isInfiniteMode
		? (props as InfiniteScrollProps).hasNextPage
		: false;
	const isFetchingNextPage = isInfiniteMode
		? (props as InfiniteScrollProps).isFetchingNextPage
		: false;
	const fetchNextPage = isInfiniteMode
		? (props as InfiniteScrollProps).fetchNextPage
		: () => {};

	const table = useReactTable({
		data: allTickets,
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

	const { rows } = table.getRowModel();

	// Virtualizer setup
	const parentRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 5,
	});

	// Infinite scroll: load more when near bottom
	const lastItemIndex = virtualizer.getVirtualItems().at(-1)?.index;

	const loadMoreIfNeeded = useCallback(() => {
		if (
			lastItemIndex !== undefined &&
			lastItemIndex >= rows.length - 5 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [
		lastItemIndex,
		rows.length,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	]);

	useEffect(() => {
		loadMoreIfNeeded();
	}, [loadMoreIfNeeded]);

	const virtualItems = virtualizer.getVirtualItems();

	// Get total count info
	const totalLoaded = allTickets.length;

	return (
		<div className="flex-1 overflow-hidden bg-muted/5 p-6">
			<div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
				{/* Header - Fixed, not scrollable */}
				<Table className="table-fixed">
					<TableHeader className="bg-muted/50 backdrop-blur-sm">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-b-muted hover:bg-transparent"
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

				{/* Body - Virtualized and Scrollable */}
				<div
					ref={parentRef}
					className="flex-1 overflow-auto [scrollbar-gutter:stable]"
				>
					{props.isLoading ? (
						<Table className="table-fixed">
							<TableBody>
								{Array.from({ length: 10 }).map((_, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items are static
									<TableRow key={i}>
										{columns.map((_, j) => {
											// Approximate widths based on column definitions or guess
											// This is a simple skeleton approach
											return (
												// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items are static
												<TableCell key={j} className="h-[65px] p-4">
													<Skeleton className="h-4 w-full" />
												</TableCell>
											);
										})}
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : rows.length > 0 ? (
						<div
							style={{
								height: `${virtualizer.getTotalSize()}px`,
								width: "100%",
								position: "relative",
							}}
						>
							{virtualItems.map((virtualRow) => {
								const row = rows[virtualRow.index];
								return (
									<button
										key={row.id}
										type="button"
										data-state={row.getIsSelected() && "selected"}
										onClick={() => onTicketClick(row.original)}
										className="flex w-full cursor-pointer items-center border-b bg-transparent text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: `${virtualRow.size}px`,
											transform: `translateY(${virtualRow.start}px)`,
										}}
									>
										{row.getVisibleCells().map((cell) => {
											const meta = cell.column.columnDef.meta as
												| { className?: string }
												| undefined;
											return (
												<div
													key={cell.id}
													className={`p-4 ${meta?.className ?? ""}`}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</div>
											);
										})}
									</button>
								);
							})}
						</div>
					) : (
						<Table className="table-fixed">
							<TableBody>
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										{emptyState ?? "No tickets found."}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					)}
				</div>

				{/* Footer with count and loading indicator */}
				<div className="flex items-center justify-center gap-2 border-t bg-card p-4 text-muted-foreground text-xs">
					{isFetchingNextPage ? (
						<>
							<Loader2 className="h-3 w-3 animate-spin" />
							<span>Loading more tickets...</span>
						</>
					) : (
						<span>
							Showing {totalLoaded} tickets
							{hasNextPage && " • Scroll for more"}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
