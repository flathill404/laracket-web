import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib";
import { useInfiniteTickets } from "../../hooks/useInfiniteTickets";
import {
	STATUS_BG_COLORS,
	STATUS_LABELS,
	type TicketStatus,
} from "../../utils/constants";
import { BoardTicketCard } from "./BoardTicketCard";

interface BoardColumnProps {
	projectId: string;
	status: TicketStatus;
}

export function BoardColumn({ projectId, status }: BoardColumnProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteTickets(projectId, {
			status: [status],
		});

	const tickets = useMemo(() => {
		return data?.pages.flatMap((page) => page.data) ?? [];
	}, [data]);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		return dropTargetForElements({
			element: el,
			getData: () => ({ status }),
			onDragEnter: () => setIsDraggedOver(true),
			onDragLeave: () => setIsDraggedOver(false),
			onDrop: () => setIsDraggedOver(false),
		});
	}, [status]);

	// Virtualizer setup
	const parentRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: tickets.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 100, // Estimated card height
		overscan: 5,
	});

	// Infinite scroll
	useEffect(() => {
		const virtualItems = virtualizer.getVirtualItems();
		const lastItem = virtualItems.at(-1);
		if (
			lastItem &&
			lastItem.index >= tickets.length - 3 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [
		tickets.length,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		virtualizer,
	]);

	return (
		<div
			ref={ref}
			className={cn(
				"flex h-full min-w-[280px] flex-1 flex-col rounded-lg border bg-muted/30 transition-colors",
				isDraggedOver && "border-primary/20 bg-muted",
			)}
		>
			<div className="flex items-center justify-between border-b p-4 pb-2">
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"h-3 w-3 rounded-full border border-transparent",
							STATUS_BG_COLORS[status],
						)}
					/>
					<h3 className="font-semibold text-sm">{STATUS_LABELS[status]}</h3>
				</div>
				<span className="font-mono text-muted-foreground text-xs">
					{tickets.length}
				</span>
			</div>

			<div
				ref={parentRef}
				className="scrollbar-hide flex-1 overflow-y-auto p-2"
			>
				{isLoading ? (
					<div className="flex justify-center p-4">
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					</div>
				) : (
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							position: "relative",
							width: "100%",
						}}
					>
						{virtualizer.getVirtualItems().map((virtualRow) => {
							const ticket = tickets[virtualRow.index];
							return (
								<div
									key={ticket.id}
									ref={virtualizer.measureElement}
									data-index={virtualRow.index}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										transform: `translateY(${virtualRow.start}px)`,
									}}
									className="p-1"
								>
									<BoardTicketCard ticket={ticket} />
								</div>
							);
						})}
					</div>
				)}
				{isFetchingNextPage && (
					<div className="flex justify-center py-2">
						<Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
					</div>
				)}
			</div>
		</div>
	);
}
