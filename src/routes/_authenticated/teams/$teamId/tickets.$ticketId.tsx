import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchTicket } from "@/features/tickets/api/tickets";
import { TicketDetailSheet } from "@/features/tickets/components/ticket-detail-sheet";

const ticketQuery = (ticketId: string) =>
	queryOptions({
		queryKey: ["tickets", ticketId],
		queryFn: () => fetchTicket(ticketId),
	});

export const Route = createFileRoute(
	"/_authenticated/teams/$teamId/tickets/$ticketId",
)({
	loader: ({ context: { queryClient }, params: { ticketId } }) => {
		return queryClient.ensureQueryData(ticketQuery(ticketId));
	},
	component: TicketDetailRoute,
});

function TicketDetailRoute() {
	const { ticketId } = Route.useParams();
	const navigate = Route.useNavigate();

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
