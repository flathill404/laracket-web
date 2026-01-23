import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import { UserAvatarStack } from "@/components/common/user-avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Ticket } from "@/features/tickets/components/columns";
import { formatDateLocale, isOverdue } from "@/lib/date";
import { cn } from "@/utils";

interface BoardTicketCardProps {
	ticket: Ticket;
}

export function BoardTicketCard({ ticket }: BoardTicketCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		return draggable({
			element: el,
			getInitialData: () => ({
				type: "ticket",
				ticketId: ticket.id,
				status: ticket.status,
			}),
			onDragStart: () => setDragging(true),
			onDrop: () => setDragging(false),
		});
	}, [ticket]);

	return (
		<div ref={ref} className={dragging ? "opacity-50" : ""}>
			<Card className="cursor-grab transition-colors hover:border-primary/50 active:cursor-grabbing">
				<CardHeader className="px-4">
					<div className="flex items-start justify-between gap-2">
						<span className="font-mono text-muted-foreground text-xs">
							{ticket.id.slice(0, 8)}
						</span>
						{/* Priority indicator could go here */}
					</div>
					<h4 className="line-clamp-2 font-medium text-sm leading-tight">
						{ticket.title}
					</h4>
				</CardHeader>
				<CardContent className="px-4">
					<h5 className="line-clamp-2 text-gray-500 text-sm leading-tight">
						{ticket.description}
					</h5>
					<div className="mt-2 flex items-center justify-between">
						<UserAvatarStack
							users={ticket.assignees}
							size="xs"
							emptyContent={
								<div className="flex h-5 w-5 items-center justify-center rounded-full border border-background bg-muted">
									<span className="text-[9px] text-muted-foreground">?</span>
								</div>
							}
						/>
						{ticket.dueDate && (
							<span
								className={cn(
									"text-[10px] text-muted-foreground",
									isOverdue(ticket.dueDate) &&
										!["resolved", "closed"].includes(ticket.status) &&
										"font-medium text-destructive",
								)}
							>
								{formatDateLocale(ticket.dueDate)}
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
