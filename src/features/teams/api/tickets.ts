import { ticketsSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";

export const fetchTeamTickets = async (teamId: string) => {
	const response = await client.get(`/teams/${teamId}/tickets`);
	const json = await response.json();
	return ticketsSchema.parse(json.data);
};
