import { client } from "@/lib/client";
import { activitiesSchema } from "../types/schemas";

// Re-export types
export type { Activity } from "../types";

// API Functions
export const fetchTicketActivities = async (ticketId: string) => {
	const response = await client.get(`/tickets/${ticketId}/activities`);
	const json = await response.json();
	return activitiesSchema.parse(json.data);
};
