import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { updateTicketStatus } from "@/features/tickets/api/tickets";
import { BoardColumn } from "@/features/tickets/components/board/BoardColumn";
import { BoardColumnSkeleton } from "@/features/tickets/components/board/BoardColumnSkeleton";
import {
	ALL_STATUSES,
	type TicketStatus,
} from "@/features/tickets/utils/constants";
import { ticketQueries } from "@/features/tickets/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/board",
)({
	loader: ({ context: { queryClient }, params: { projectId } }) => {
		// Prefetch all status columns in parallel (secondary, don't block)
		for (const status of ALL_STATUSES) {
			queryClient.prefetchInfiniteQuery(
				ticketQueries.list(projectId, {
					filters: { status: [status] },
				}),
			);
		}
	},
	component: ProjectBoard,
});

function ProjectBoard() {
	const { projectId } = Route.useParams();
	const queryClient = useQueryClient();

	const { mutate: moveTicket } = useMutation({
		mutationFn: ({
			ticketId,
			status,
		}: {
			ticketId: string;
			status: TicketStatus;
		}) => updateTicketStatus(ticketId, { status }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
			toast.success("Ticket status updated");
		},
		onError: () => {
			toast.error("Failed to update ticket status");
		},
	});

	useEffect(() => {
		return monitorForElements({
			onDrop: ({ source, location }) => {
				const destination = location.current.dropTargets[0];
				if (!destination) return;

				const ticketId = source.data.ticketId as string;
				const newStatus = destination.data.status as TicketStatus;
				const currentStatus = source.data.status as TicketStatus;

				if (newStatus === currentStatus) return;

				moveTicket({ ticketId, status: newStatus });
			},
		});
	}, [moveTicket]);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-x-auto overflow-y-hidden">
				<div className="flex h-full min-w-full gap-4 p-6">
					{ALL_STATUSES.map((status) => (
						<Suspense key={status} fallback={<BoardColumnSkeleton />}>
							<BoardColumn projectId={projectId} status={status} />
						</Suspense>
					))}
				</div>
			</div>
		</div>
	);
}
