import { createFileRoute } from "@tanstack/react-router";
import { TicketDetailSheet } from "@/features/tickets/components/ticket-detail-sheet";
import { ticketQueries } from "@/features/tickets/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/tickets/$ticketId",
)({
	loader: ({ context: { queryClient }, params: { ticketId } }) => {
		return queryClient.ensureQueryData(ticketQueries.detail(ticketId));
	},
	component: TicketDetailRoute,
});

function TicketDetailRoute() {
	const { ticketId } = Route.useParams();
	const navigate = Route.useNavigate();

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			// Navigate back to the tickets list (parent route), preserving search params
			navigate({ to: "..", search: true });
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
