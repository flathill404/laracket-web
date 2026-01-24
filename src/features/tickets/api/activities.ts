import { client } from "@/lib/client";
import { activitiesSchema } from "../types/schemas";

export const fetchTicketActivities = async (ticketId: string) => {
	const response = await client.get(`/tickets/${ticketId}/activities`);
	const json = await response.json();
	return activitiesSchema.parse(json.data);
};
