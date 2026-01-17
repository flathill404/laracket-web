import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fetchTicket } from "@/api";
import { TicketDetailSheet } from "@/components/ticket-detail-sheet";

// Helper to define types for the status based on the API
const ticketQuery = (ticketId: string) =>
	queryOptions({
		queryKey: ["tickets", ticketId],
		queryFn: () => fetchTicket(ticketId),
	});

export const Route = createFileRoute("/_authenticated/tickets/$ticketId")({
	loader: ({ context: { queryClient }, params: { ticketId } }) => {
		return queryClient.ensureQueryData(ticketQuery(ticketId));
	},
	component: TicketDetailRoute,
});

function TicketDetailRoute() {
	const { ticketId } = Route.useParams();
	const navigate = useNavigate();

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			// Navigate back to the tickets list (parent route)
			navigate({ to: "..", search: (old) => old });
		}
	};

	return (
		<TicketDetailSheet
			ticketId={ticketId}
			open={true}
			onOpenChange={handleOpenChange}
		/>
	);
}
